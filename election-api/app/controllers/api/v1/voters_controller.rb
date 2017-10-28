class Api::V1::VotersController < ApplicationController
  acts_as_token_authentication_handler_for User, fallback: :none
  before_action :set_voter, only: [:show, :update, :destroy]
  before_action :set_current_user_by_token, only: [:index]

  # GET /voters
  def index
    if @current_user.is_superadmin?
      @voters = Voter.all
    elsif @current_user.is_manager?
      @voters = Voter.where(suborganization_id: @current_user.suborganization_id)
    else
      @voters = Voter.where(user: params[:uid].to_i)
    end

    if params["per_page"].present? && params["page"].present? &&
      ((lim = params["per_page"].to_i) != 0) && ((off = params["page"].to_i * lim) != 0)
      @voters.order(:id).offset(off-lim).limit(lim)  
      render json: @voters, meta: { total: (Voter.count/lim).ceil }
    elsif params["name"].present?
      name = params["name"]
      @voters = @voters.where(first_name: name).or(@voters.where(first_last_name: name))
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
    user = User.find(voter_params[:user_id])
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
      params.require(:voter).permit(:user_id, :electoral_id_number, :expiration_date, :first_name, :second_name, :first_last_name, :second_last_name, :gender,   :date_of_birth, :electoral_code, :CURP, :section, :street, :outside_number, :inside_number, :suburb, :locality_code, :locality, :municipality_code, :municipality, :state_code, :state, :postal_code, :home_phone, :mobile_phone, :email, :alternative_email, :facebook_account, :highest_educational_level, :current_ocupation, :organization, :party_positions_held, :is_part_of_party, :has_been_candidate, :popular_election_position, :election_year, :won_election, :election_route, :notes)
    end
end
