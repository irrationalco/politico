class ProyectionDataController < ApplicationController
  before_action :set_proyection_datum, only: [:show, :update, :destroy]

  # GET /proyection_data
  def index
    @proyection_data = ProyectionDatum.all

    render json: @proyection_data
  end

  # GET /proyection_data/1
  def show
    render json: @proyection_datum
  end

  # POST /proyection_data
  def create
    @proyection_datum = ProyectionDatum.new(proyection_datum_params)

    if @proyection_datum.save
      render json: @proyection_datum, status: :created, location: @proyection_datum
    else
      render json: @proyection_datum.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /proyection_data/1
  def update
    if @proyection_datum.update(proyection_datum_params)
      render json: @proyection_datum
    else
      render json: @proyection_datum.errors, status: :unprocessable_entity
    end
  end

  # DELETE /proyection_data/1
  def destroy
    @proyection_datum.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_proyection_datum
      @proyection_datum = ProyectionDatum.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def proyection_datum_params
      params.fetch(:proyection_datum, {})
    end
end
