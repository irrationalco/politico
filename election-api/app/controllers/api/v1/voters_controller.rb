class Api::V1::VotersController < ApplicationController
  acts_as_token_authentication_handler_for User, fallback: :none
  before_action :set_voter, only: [:show, :update, :destroy]
  before_action :set_current_user_by_token, only: [:index]

  # GET /voters
  def index
    # TODO: Encapsulate in a function
    if @current_user.is_superadmin?
      @voters = Voter.all
    elsif @current_user.is_manager?
      @voters = Voter.where(suborganization_id: @current_user.suborganization_id)
    else
      @voters = Voter.where(user: params[:uid].to_i)
    end

    @voters = @voters.order(created_at: :desc)

    # TODO: This needs to be more clear.
    # if params["per_page"].present? && params["page"].present? &&
    #   ((lim = params["per_page"].to_i) != 0) && ((off = params["page"].to_i * lim) != 0)
    #   @voters.order(:id).offset(off-lim).limit(lim)  
    #   render json: @voters, meta: { total: (Voter.count/lim).ceil }
    
    if params["q"].present?
      @q = Voter.ransack(
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
      render json: @voters
    else
      render json: @voters
    end
  end

  def file_upload
    begin
      invalidRows = Voter.import(params[:file], params[:user_id].to_i)
    rescue
      render status: 	:no_content
      return
    end
    unless invalidRows.nil?
      send_data invalidRows, filename: "registrosInvalidos-#{Date.today}.csv", type: :csv, status: :partial_content
    else
      render status: :created
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
    if user
      @voter[:suborganization_id] = user[:suborganization_id]
    end
    
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
