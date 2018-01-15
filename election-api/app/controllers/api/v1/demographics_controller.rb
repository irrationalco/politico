class Api::V1::DemographicsController < ApplicationController
  acts_as_token_authentication_handler_for User, fallback: :none

  def index
    @demographics = nil
    if needed_params_present?('state', 'municipality')
      state = State.find_state_by_name(params['state'])
      muni  = state.find_state_municipality(params['municipality'])
      @demographics = Demographic.all.municipal(state.state_code, muni.muni_code, 2015)

      puts "DEMOGRAPHICS"
      ap @demographics
    end

    render json: @demographics

  rescue State::DataNotFound => e
    logger.error e.backtrace.first(5).join('\n')
    logger.error "*ERROR* Demographics#index -> #{e}"
  end
end