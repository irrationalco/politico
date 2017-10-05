class Api::V1::VotersController < ApplicationController
  before_action :set_voter, only: [:show, :update, :destroy]

  # GET /voters
  def index
    if params["per_page"].present? && params["page"].present? &&
      ((lim = params["per_page"].to_i) != 0) && ((off = params["page"].to_i * lim) != 0)
      @voters = Voter.all.order(:id).offset(off-lim).limit(lim)
      render json: @voters, meta: { total: (Voter.count/lim).ceil }
    else
      @voters = Voter.all
      render json: @voters
    end
  end

  def file_upload
    invalidRows = Voter.import(params[:file])
    unless invalidRows.nil?
      send_data invalidRows, filename: "registrosInvalidos-#{Date.today}.csv", type: :csv
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
      params.require(:voter).permit(:captured_by, :electoral_id_number, :expiration_date, :first_name, :second_name, :first_last_name, :second_last_name, :gender,   :date_of_birth, :electoral_code, :CURP, :section, :street, :outside_number, :inside_number, :suburb, :locality_code, :locality, :municipality_code, :municipality, :state_code, :state, :postal_code, :home_phone, :mobile_phone, :email, :alternative_email, :facebook_account, :highest_educational_level, :current_ocupation, :organization, :party_positions_held, :is_part_of_party, :has_been_candidate, :popular_election_position, :election_year, :won_election, :election_route, :notes)
    end
end
