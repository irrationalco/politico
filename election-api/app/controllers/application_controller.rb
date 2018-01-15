class ApplicationController < ActionController::API
  private

  def request_auth_token
    request.headers['HTTP_AUTHORIZATION'].split(' ').last
  end

  def set_current_user_by_token
    @current_user = User.find_by_token(request_auth_token)
  end

  def verify_user_is_admin
    set_current_user_by_token
    render json: {}, status: 401 unless @current_user.is_superadmin?
  end

  def verify_user_is_admin_or_manager
    set_current_user_by_token
    render json: {}, status: 401 unless @current_user.is_superadmin? || @current_user.is_manager?
  end

  # Utilities
  
  # Function to make params check more explicit
  def needed_params_present?(*ar_params)
    ar_params.flatten.all? { |e| params[e].present? }
  end
end
