class Api::V1::VotersController < ApplicationController
  acts_as_token_authentication_handler_for User, fallback: :none
  before_action :set_voter, only: %i[show update destroy]
  before_action :set_current_user_by_token, only: [:index, :dashboard]

  # GET /voters
  def index
    # TODO: Encapsulate in a function
    @voters = if @current_user.is_superadmin?
                Voter.all
              elsif @current_user.is_manager?
                Voter.where(suborganization_id: @current_user.suborganization_id)
              else
                Voter.where(user: params[:uid].to_i)
              end

    @voters = @voters.order(created_at: :desc)

    if params['q'].present?
      @q = @voters.ransack(
        first_name_cont:          params[:q],
        first_last_name_cont:     params[:q],
        second_last_name_cont:    params[:q],
        state_cont:               params[:q],
        municipality_cont:        params[:q],
        electoral_code_cont:      params[:q],
        electoral_id_number_cont: params[:q],
        m: 'or'
      )
      @voters = @q.result(distinct: true)
    end

    if params['per_page'].present? && params['page'].present?
      @voters = @voters.page(params['page']).per(params['per_page'])
      render json: @voters, meta: { total: @voters.total_pages }
    else
      render json: @voters
    end
  end

  def file_upload
    begin
      invalid_rows = Voter.import(params[:file], params[:user_id].to_i)
    rescue StandardError
      render status:	:no_content
      return
    end
    if invalid_rows.nil?
      render status: :created
    else
      send_data invalid_rows, filename: "registrosInvalidos-#{Date.today}.csv", type: :csv, status: :partial_content
    end
  end

  # GET /voters/1
  def show
    render json: @voter
  end

  # POST /voters
  def create
    @voter = Voter.new(voter_params)
    user = User.find_by(id: voter_params[:user_id])
    @voter[:suborganization_id] = user[:suborganization_id] if user

    if @voter.save
      render json: @voter, status: :created
    else
      render json: @voter.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /voters/1
  def update
    if @voter.update(voter_params)
      render json: @voter
    else
      render json: @voter.errors, status: :unprocessable_entity
    end
  end

  # DELETE /voters/1
  def destroy
    @voter.destroy
  end

  def dashboard
    result = nil
    if params['chart'].present?
      if !params['capturist'].present?
        params['capturist'] = ''
      end
      all_args = [params['state'], params['muni'], params['section'], params['capturist']]
    case params['chart']
    when 'gender'
        result = gender_chart *all_args
    when 'date_of_birth'
        result = date_of_birth_chart *all_args
    when 'ed_level'
        result = education_level_chart *all_args
    when 'added_day'
        result = added_by_day_chart *all_args
    when 'added_week'
        result = added_by_week_chart *all_args
    when 'added_month'
        result = added_by_month_chart *all_args
      when 'ocupation'
        result = ocupation_chart *all_args
      when 'party'
        result = party_chart *all_args
      when 'state'
        result = state_chart params['capturist']
      when 'email'
        result = email_chart *all_args
      when 'phone'
        result = phone_chart *all_args
      when 'facebook'
        result = facebook_chart *all_args
      when 'municipality'
        result = municipality_chart params['state'], params['capturist']
      when 'section'
        result = section_chart params['state'], params['muni'], params['capturist']
      when 'capturists'
        result = capturist_chart params['state'], params['muni'], params['section']
      end
    elsif params['info'].present?
      if !params['capturist'].present?
        params['capturist'] = ''
      end
      case params['info']
      when 'total'
        result = total_info params['state'], params['muni'], params['section'], params['capturist']
      when 'geo_data'
        result = geo_data_info params['capturist']
      when 'municipalities'
        result = municipality_info params['state'], params['capturist']
      when 'sections'
        result = section_info params['state'], params['muni'], params['capturist']
      when 'capturists'
        result = capturist_info
      end
    end
    if result.nil?
      render status: :unprocessable_entity
    else
      render json: result
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_voter
    @voter = Voter.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def voter_params
    ActiveModelSerializers::Deserialization.jsonapi_parse(params)
  end

    def gender_chart state, muni, section, capturist
      res = Voter.filtered(@current_user, state, muni, section, capturist).where.not(gender: nil).group(:gender).count
      return res if res.empty?
      res = {"Hombres": res['H'] || 0, "Mujeres": res['M'] || 0}
    end

    def date_of_birth_chart state, muni, section, capturist
      res = Voter.filtered(@current_user, state, muni, section, capturist).group_by_year(:date_of_birth).count
    end

    def education_level_chart state, muni, section, capturist
      res = Voter.filtered(@current_user, state, muni, section, capturist).where.not(highest_educational_level: nil).group(:highest_educational_level).count
    end

    def added_by_day_chart state, muni, section, capturist
      res = Voter.filtered(@current_user, state, muni, section, capturist).group_by_day(:created_at, last: 62).count
    end

    def added_by_week_chart state, muni, section, capturist
      res = Voter.filtered(@current_user, state, muni, section, capturist).group_by_week(:created_at, last: 52).count
    end

    def added_by_month_chart state, muni, section, capturist
      res = Voter.filtered(@current_user, state, muni, section, capturist).group_by_month(:created_at, last: 36).count
    end

    def ocupation_chart state, muni, section, capturist
      res = Voter.filtered(@current_user, state, muni, section, capturist).where.not(current_ocupation: nil).group(:current_ocupation).count
    end

    def party_chart state, muni, section, capturist
      res = Voter.filtered(@current_user, state, muni, section, capturist).where.not(is_part_of_party: nil).group(:is_part_of_party).count
      return res if res.empty?
      res = {"Si": res[true] || 0, "No": res[false] || 0}
    end

    def state_chart capturist = ''
      res = Voter.filtered(@current_user,'','','',capturist).where.not(state: nil).group(:state).count
    end

    def municipality_chart state, capturist = ''
      res = Voter.filtered(@current_user, state,'','',capturist).where.not(municipality: nil).group(:municipality).count
    end

    def section_chart state, muni, capturist = ''
      res = Voter.filtered(@current_user, state, muni,'',capturist).where.not(section: nil).group(:section).count
      result = {}
      res.each {|k,v| result[k.to_i]=v}
      return result
    end

    def capturist_chart state, muni, section
      res = Voter.filtered(@current_user, state, muni, section).group(:user_id).count
      capturists = User.where(suborganization_id: @current_user.suborganization_id)
                          .where(capturist: true).pluck(:id, :first_name, :last_name)
      result = {}
      capturists.each {|c| result["#{c[1]} #{c[2]}"] = res[c[0]]}
      result
    end

    def email_chart state, muni, section, capturist
      res = Voter.filtered(@current_user, state, muni, section, capturist).where.not(email: nil).count
      res = {"Si": res || 0, "No": Voter.filtered(@current_user, state, muni, section, capturist).count - res || 0}
    end

    def phone_chart state, muni, section, capturist 
      res = Voter.filtered(@current_user, state, muni, section, capturist).where("NOT (home_phone IS NULL AND mobile_phone IS NULL)").count
      res = {"Si": res || 0, "No": Voter.filtered(@current_user, state, muni, section, capturist).count - res || 0}
    end

    def facebook_chart state, muni, section, capturist
      res = Voter.filtered(@current_user, state, muni, section, capturist).where.not(facebook_account: nil).count
      res = {"Si": res || 0, "No": Voter.filtered(@current_user, state, muni, section, capturist).count - res || 0}
    end

    def total_info state, muni, section, capturist
      res = Voter.filtered(@current_user, state, muni, section, capturist).count
    end

    def geo_data_info capturist = ''
      res = Voter.filtered(@current_user,'','','',capturist).distinct.pluck(:state, :state_code)
      res.map {|st| {name: st[0], 
                        id: st[1].to_i, 
                        activeMunis: municipality_info(st[1].to_s, capturist)}}
    end

    def municipality_info state, capturist = ''
      res = Voter.filtered(@current_user, state,'','',capturist).distinct.pluck(:municipality)
      res.map {|mn| {name: mn, 
                        activeSections: section_info(state, mn, capturist)}}
    end

    #TODO: use municipality id instead of the actual text
    def section_info state, municipality, capturist = ''
      res = Voter.filtered(@current_user, state, municipality,'',capturist).distinct.pluck(:section)
      res.map {|section| section.to_i}
    end

    def capturist_info
      if !(@current_user.is_superadmin? || @current_user.is_manager? || @current_user.is_supervisor?)
        return nil
      end
      res = User.where(suborganization_id: @current_user.suborganization_id)
                  .where(capturist: true).pluck(:id, :first_name, :last_name)
      res.map {|user| {id: user[0].to_i, 
                          name: "#{user[1]} #{user[2]}",
                          activeStates: deepArrayToHash(geo_data_info(user[0].to_s),[:id,:name,nil],[:activeMunis,:activeSections], 0, 2)}}
    end

    def deepArrayToHash arr, keys, recKeys, depth, maxDepth
      res = {}
      if keys[depth].nil?
        arr.each {|x| res[x] = true }
        return res
      end
      arr.each do |x|
        if depth < maxDepth
          x[recKeys[depth]] = deepArrayToHash(x[recKeys[depth]], keys, recKeys, depth+1, maxDepth)
        end
        res[x[keys[depth]]] = x
      end
      return res
    end
end
