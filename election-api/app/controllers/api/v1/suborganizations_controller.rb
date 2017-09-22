class Api::V1::SuborganizationsController < ApplicationController
  before_action :set_suborganization, only: [:show, :update, :destroy]

  # GET /suborganizations
  def index
    @suborganizations = Suborganization.all

    render json: @suborganizations, include: 'users'
  end

  # render json: @blog, include: 'posts.category, posts.author.address', fields: { posts: { category: [:name], author: [:id, :name] } }


  # GET /suborganizations/1
  def show
    render json: @suborganization
  end

  # POST /suborganizations
  def create
    @suborganization = Suborganization.new(suborganization_params)

    if @suborganization.save
      render json: @suborganization
    else
      render json: @suborganization.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /suborganizations/1
  def update
    if @suborganization.update(suborganization_params)
      render json: @suborganization
    else
      render json: @suborganization.errors, status: :unprocessable_entity
    end
  end

  # DELETE /suborganizations/1
  def destroy
    @suborganization.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_suborganization
      @suborganization = Suborganization.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def suborganization_params
      params.require(:suborganization).permit(:name)
    end
end
