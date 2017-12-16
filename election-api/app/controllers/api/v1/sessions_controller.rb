class Api::V1::SessionsController < ApplicationController
  acts_as_token_authentication_handler_for User, only: [:destroy]

  def create
    user = User.where(email: params[:username]).first

    if user.valid_password?(params[:password])
      data = {
        access_token: user.authentication_token,
        email:        user.email,
        id:           user.id
      }
      render json: data, status: 201 && return
    else
      head(:unauthorized)
    end
  end

  def destroy
    current_user.authentication_token = nil
    if current_user.save
      head(:ok)
    else
      head(:unauthorized)
    end
  end
end
