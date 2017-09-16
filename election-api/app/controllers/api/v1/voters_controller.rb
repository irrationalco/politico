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
      params.require(:voter).permit(:electoral_code, :name, :first_last_name, :second_last_name, :date_of_birth, :street, :outside_number, :inside_number, :suburb, :postal_code, :TIMERES, :occupation, :FOL_NAC, :EN_LN, :municipality_name, :state, :district, :municipality, :section, :locality, :apple, :CONS_LC, :EMISIONCRE)
    end
end
