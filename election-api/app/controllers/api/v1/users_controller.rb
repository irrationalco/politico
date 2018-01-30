class Api::V1::UsersController < ApplicationController
  acts_as_token_authentication_handler_for User, fallback: :none
  before_action :set_user, only: %i[show update destroy]
  before_action :verify_user_is_admin, except: %i[user_by_email show index]
  before_action :verify_user_is_admin_or_manager, only: [:index]

  # GET /users
  def index
    @users = if @current_user.is_manager?
               User.where(suborganization_id: @current_user.suborganization_id)
             else
               User.all
             end
    render json: @users
  end

  def user_by_email
    @user = User.where(email: params['email']).take if params['email'].present?

    if @user
      data = {
        id:         @user.id,
        email:      @user.email,
        firstName:  @user.first_name,
        lastName:   @user.last_name,
        superadmin: @user.superadmin,
        manager:    @user.manager,
        supervisor: @user.supervisor,
        capturist:  @user.capturist,
        suborganizationId: @user.suborganization_id
      }
      render(json: data, status: 201) && return
    else
      render(json: {}, status: 404) && return
    end
  end

  # GET /users/1
  def show
    render json: @user
  end

  # POST /users
  def create
    @user = User.new(user_params)

    if @user.save
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /users/1
  def update
    if @user.update(user_params)
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # DELETE /users/1
  def destroy
    @user.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_user
    @user = User.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def user_params
    params.require(:user).permit(:email, :password, :first_name, :last_name, :suborganization_id,
                                 :manager, :supervisor, :capturist)
  end
end
