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
    if !params['chart'].present?
      render status: :unprocessable_entity
    end
    result = nil
    case params['chart']
    when 'gender'
      result = gender_chart
    when 'date_of_birth'
      result = date_of_birth_chart
    when 'ed_level'
      result = education_level_chart
    when 'added_day'
      result = added_by_day_chart
    when 'added_week'
      result = added_by_week_chart
    when 'added_month'
      result = added_by_month_chart
    
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

    def gender_chart
      res = Voter.where(user_id: @current_user.id).where.not(gender: nil).group(:gender).count
      return res if res.empty?
      res = {"Hombres": res['H'], "Mujeres": res['M']}
    end

    def date_of_birth_chart
      res = Voter.where(user_id: @current_user.id).group_by_year(:date_of_birth).count
    end

    def education_level_chart
      res = Voter.where(user_id: @current_user.id).where.not(highest_educational_level: nil).group(:highest_educational_level).count
    end

    def added_by_day_chart
      res = Voter.where(user_id: @current_user.id).group_by_day(:created_at).count
    end

    def added_by_week_chart
      res = Voter.where(user_id: @current_user.id).group_by_week(:created_at).count
    end

    def added_by_month_chart
      res = Voter.where(user_id: @current_user.id).group_by_month(:created_at).count
    end

end
