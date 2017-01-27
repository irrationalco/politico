class Api::V1::ProyectionsController < ApplicationController
  before_action :set_proyection, only: [:show, :update, :destroy]

  # GET /proyections
  def index
    @proyections = Proyection.all

    render json: @proyections
  end

  # GET /proyections/1
  def show
    render json: @proyection
  end

  # POST /proyections
  def create
    @proyection = Proyection.new(proyection_params)

    if @proyection.save
      render json: @proyection, status: :created, location: @proyection
    else
      render json: @proyection.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /proyections/1
  def update
    if @proyection.update(proyection_params)
      render json: @proyection
    else
      render json: @proyection.errors, status: :unprocessable_entity
    end
  end

  # DELETE /proyections/1
  def destroy
    @proyection.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_proyection
      @proyection = Proyection.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def proyection_params
      params.require(:proyection).permit(:type)
    end
end
