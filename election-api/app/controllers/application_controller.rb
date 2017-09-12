class ApplicationController < ActionController::API
  
  private

  def request_auth_token
    request.headers['HTTP_AUTHORIZATION'].split(" ").last
  end

  def set_current_user_by_token
    @current_user = User.find_by_token(request_auth_token)
  end

  def verify_user_is_admin
    set_current_user_by_token()
    unless @current_user.is_superadmin?
      render json: {}, status: 401
    end
  end
end
