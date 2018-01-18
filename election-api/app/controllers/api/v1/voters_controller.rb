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
      when 'ocupation'
        result = ocupation_chart
      when 'party'
        result = party_chart
      when 'state'
        result = state_chart
      when 'email'
        result = email_chart
      when 'phone'
        result = phone_chart
      when 'facebook'
        result = facebook_chart
      when /^municipality\.(.+)$/
        result = municipality_chart $1
      when /^section\.([^\.]+)\.([^\.]+)$/
        result = section_chart $1, $2
      end
    elsif params['stats'].present?
      case params['stats']
      when 'total'
        result = total_stats
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

    def gender_chart
      res = Voter.where(user_id: @current_user.id).where.not(gender: nil).group(:gender).count
      return res if res.empty?
      res = {"Hombres": res['H'] || 0, "Mujeres": res['M'] || 0}
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

    def ocupation_chart
      res = Voter.where(user_id: @current_user.id).where.not(current_ocupation: nil).group(:current_ocupation).count
    end

    def party_chart
      res = Voter.where(user_id: @current_user.id).where.not(is_part_of_party: nil).group(:is_part_of_party).count
      return res if res.empty?
      res = {"Si": res[true] || 0, "No": res[false] || 0}
    end

    def state_chart
      res = res = Voter.where(user_id: @current_user.id).where.not(state: nil).group(:state).count
    end

    def municipality_chart state
      res = Voter.where(user_id: @current_user.id).where(state: state).where.not(municipality: nil).group(:municipality).count
    end

    def section_chart state, municipality
      res = Voter.where(user_id: @current_user.id).where(state: state).where(municipality: municipality).where.not(section: nil).group(:section).count
    end

    def email_chart
      res = Voter.where(user_id: @current_user.id).where.not(email: nil).count
      res = {"Si": res || 0, "No": Voter.where(user_id: @current_user.id).count - res || 0}
    end

    def phone_chart 
      res = Voter.where(user_id: @current_user.id).where("NOT (home_phone IS NULL OR mobile_phone IS NULL)").count
      res = {"Si": res || 0, "No": Voter.where(user_id: @current_user.id).count - res || 0}
    end

    def facebook_chart
      res = Voter.where(user_id: @current_user.id).where.not(facebook_account: nil).count
      res = {"Si": res || 0, "No": Voter.where(user_id: @current_user.id).count - res || 0}
    end

    def total_stats
      res = Voter.where(user_id: @current_user.id).count
    end
end
