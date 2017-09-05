class Api::V1::ElectoralDataController < ApplicationController
  before_action :set_electoral_datum, only: [:show, :update, :destroy]

  # GET /electoral_data
  def index
    @electoral_data = ElectoralDatum.all

    render json: @electoral_data
  end

  # GET /electoral_data/1
  def show
    render json: @electoral_datum
  end

  # POST /electoral_data
  def create
    @electoral_datum = ElectoralDatum.new(electoral_datum_params)

    if @electoral_datum.save
      render json: @electoral_datum, status: :created, location: @electoral_datum
    else
      render json: @electoral_datum.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /electoral_data/1
  def update
    if @electoral_datum.update(electoral_datum_params)
      render json: @electoral_datum
    else
      render json: @electoral_datum.errors, status: :unprocessable_entity
    end
  end

  # DELETE /electoral_data/1
  def destroy
    @electoral_datum.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_electoral_datum
      @electoral_datum = ElectoralDatum.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def electoral_datum_params
      params.require(:electoral_datum).permit(:electoral_code, :name, :first_last_name, :second_last_name, :date_of_birth, :street, :outside_number, :inside_number, :suburb, :postal_code, :TIMERES, :occupation, :FOL_NAC, :EN_LN, :municipality_name, :state, :district, :municipality, :section, :locality, :apple, :CONS_LC, :EMISIONCRE)
    end
end
