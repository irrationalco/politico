class Api::V1::OrganizationsController < ApplicationController
  before_action :set_organization, only: %i[show update destroy]

  # GET /organizations
  def index
    @organizations = Organization.all

    render json: @organizations, include: 'users'
  end

  # render json: @blog, include: 'posts.category, posts.author.address',
  #        fields: { posts: { category: [:name], author: [:id, :name] } }

  # GET /organizations/1
  def show
    render json: @organization
  end

  # POST /organizations
  def create
    @organization = Organization.new(organization_params)

    if @organization.save
      render json: @organization
    else
      render json: @organization.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /organizations/1
  def update
    if @organization.update(organization_params)
      render json: @organization
    else
      render json: @organization.errors, status: :unprocessable_entity
    end
  end

  # DELETE /organizations/1
  def destroy
    @organization.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_organization
    @organization = Organization.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def organization_params
    params.require(:organization).permit(:name, :manager_id)
  end
end
