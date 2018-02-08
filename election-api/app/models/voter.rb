class Voter < ApplicationRecord
  require 'csv'
  belongs_to :user
  belongs_to :suborganization

  scope :filtered, ->(user:, state: '', muni: '', section: '', capturist: '') {
    res = if user.is_superadmin? || user.is_manager? || user.is_supervisor?
            where(suborganization_id: user.suborganization_id)
          else
            where(user_id: user.id)
          end
    res = res.where(state_code: state) unless state.empty?
    res = res.where(municipality: muni) unless muni.empty?
    res = res.where(section: section) unless section.empty?
    res = res.where(user_id: capturist) unless capturist.empty?
    return res
  }

  def self.group_by_not_nil(column)
    where.not(column => nil).group(column).count
  end

  def self.yes_no_chart(columns)
    yes = if columns.is_a?(Array)
            tmp = where.not(columns.shift => nil)
            columns.each { |c| tmp = tmp.or(where.not(c => nil)) }
            tmp.count
          else
            where.not(columns => nil).count
          end
    yes ||= 0
    { "Si": yes, "No": count - yes }
  end

  def self.geo_data_info(user, capturist)
    res = distinct.pluck(:state, :state_code)
    res.map do |st| { name: st[0],
                      id: st[1].to_i,
                      activeMunis: municipality_info(user, st[1].to_s, capturist) }
    end
  end

  def self.municipality_info(user, state, capturist = '')
    res = Voter.filtered(user: user, state: state, capturist: capturist).distinct.pluck(:municipality)
    res.map do |mn| { name: mn,
                      activeSections: section_info(user, state, mn, capturist) }
    end
  end

  # TODO: use municipality id instead of the actual text
  def self.section_info(user, state, municipality, capturist = '')
    res = Voter.filtered(user: user, state: state, muni: municipality, capturist: capturist).distinct.pluck(:section)
    res.map(&:to_i)
  end

  def self.capturist_chart(user, state, muni, section)
    res = Voter.filtered(user: user, state: state, muni: muni, section: section).group(:user_id).count
    capturists = User.where(suborganization_id: user.suborganization_id)
                     .where(capturist: true).pluck(:id, :first_name, :last_name)
    result = {}
    capturists.each { |c| result["#{c[1]} #{c[2]}"] = res[c[0]] }
    result
  end

  def self.capturist_info(user)
    return nil unless user.is_superadmin? || user.is_manager? || user.is_supervisor?
    res = User.where(suborganization_id: user.suborganization_id)
              .where(capturist: true).pluck(:id, :first_name, :last_name)
    res.map do |us| { id: us[0].to_i,
                      name: "#{us[1]} #{us[2]}",
                      activeStates: deep_array_to_hash(geo_data_info(user, us[0].to_s),
                                                       [:id, :name, nil],
                                                       %i[activeMunis activeSections], 0, 2) }
    end
  end

  def self.deep_array_to_hash(arr, keys, rec_keys, depth, max_depth)
    res = {}
    if keys[depth].nil?
      arr.each { |x| res[x] = true }
      return res
    end
    arr.each do |x|
      if depth < max_depth
        x[rec_keys[depth]] = deep_array_to_hash(x[rec_keys[depth]],
                                                keys, rec_keys, depth + 1, max_depth)
      end
      res[x[keys[depth]]] = x
    end
    return res
  end
end
