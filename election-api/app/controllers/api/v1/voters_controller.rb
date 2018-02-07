class Api::V1::VotersController < ApplicationController
  acts_as_token_authentication_handler_for User, fallback: :none
  before_action :set_voter, only: %i[show update destroy]
  before_action :set_current_user_by_token, only: %i[index dashboard]

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
    all_args = { user: @current_user,
                 state: params['state'] || '',
                 muni: params['muni'] || '',
                 section: params['section'] || '',
                 capturist: params['capturist'] || '' }
    if params['chart'].present?
      case params['chart']
      when 'gender'
        result = Voter.filtered(**all_args).group_by_not_nil(:gender)
        result = { "Hombres": result['H'] || 0, "Mujeres": result['M'] || 0 }
      when 'date_of_birth'
        result = Voter.filtered(**all_args).group_by_year(:date_of_birth).count
      when 'ed_level'
        result = Voter.filtered(**all_args).group_by_not_nil(:highest_educational_level)
      when 'added_day'
        result = Voter.filtered(**all_args).group_by_day(:created_at, last: 62).count
      when 'added_week'
        result = Voter.filtered(**all_args).group_by_week(:created_at, last: 52).count
      when 'added_month'
        result = Voter.filtered(**all_args).group_by_month(:created_at, last: 36).count
      when 'ocupation'
        result = Voter.filtered(**all_args).group_by_not_nil(:current_ocupation)
      when 'party'
        result = Voter.filtered(**all_args).group_by_not_nil(:is_part_of_party)
        result = { "Si": result[true] || 0, "No": result[false] || 0 }
      when 'state'
        result = Voter.filtered(**all_args).group_by_not_nil(:state)
      when 'email'
        result = Voter.filtered(**all_args).yes_no_chart(:email)
      when 'phone'
        result = Voter.filtered(**all_args).yes_no_chart(%i[home_phone mobile_phone])
      when 'facebook'
        result = Voter.filtered(**all_args).yes_no_chart(:facebook_account)
      when 'municipality'
        result = Voter.filtered(**all_args).group_by_not_nil(:municipality)
      when 'section'
        result = Voter.filtered(**all_args).group_by_not_nil(:section)
        result = result.keys.map(&:to_i).zip(result.values).to_h
      when 'capturists'
        result = Voter.capturist_chart(all_args[:user], all_args[:state], all_args[:muni], all_args[:section])
      end
    elsif params['info'].present?
      params['capturist'] = '' unless params['capturist'].present?
      case params['info']
      when 'total'
        result = Voter.filtered(**all_args).count
      when 'geo_data'
        result = Voter.filtered(**all_args).geo_data_info(all_args[:user], all_args[:capturist])
      when 'capturists'
        result = Voter.capturist_info(all_args[:user])
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
end
