class ApplicationController < ActionController::API
  
  private

  def request_auth_token
    env['HTTP_AUTHORIZATION'].split(" ").last
  end

  def set_user_by_token
    @user = User.find_by_token(request_auth_token)
  end
end
