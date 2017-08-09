class Api::V1::SessionsController < ApplicationController
  def create  
    user = User.where(email: params[:user][:email]).first

    if user&.valid_password?(params[:user][:password])
      data = {
        token: user.authentication_token,
        email: user.email
      }
      render json: data, status: 201 and return
    else
      head(:unauthorized)
    end
  end

  def destroy
    current_user&.authentication_token = nil
    if current_user&.save
      head(:ok)
    else
      head(:unauthorized)
    end
  end
end
