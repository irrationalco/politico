class Api::V1::ProjectionsController < ApplicationController
  acts_as_token_authentication_handler_for User, fallback: :none
  before_action :set_projection, only: [:show, :update, :destroy]

  # GET /projections
  def index
    year = params["year"].present? ? params["year"].to_i : 2012
    election_type = params["election"].present? ? params["election"] : "prs"

    if params["history"].present? && params['level']
      @projections = get_history(params['section'],
                                params["municipality"],
                                params["state"],
                                params["federalDistrict"],
                                params['level']).map.with_index {|p, i| p[:id] = i
                                                                      p}
    elsif needed_params_present?("state", "municipality")
      state = State.find_state_by_name(params["state"])
      muni = state.find_state_municipality(params["municipality"])
      @projections = Projection.all.municipal(state.state_code, muni.muni_code, year, election_type)
    elsif needed_params_present?("state", "federalDistrict")
      state = State.find_state_by_name(params["state"])
      @projections = Projection.all.distrital(state.state_code, params["federalDistrict"], year, election_type)
    end

    if @projections.present?
      render json: @projections
    else
      @projections = Projection.where(id: 1)
      render json: @projections
    end
  rescue State::DataNotFound => e
    logger.error e.backtrace.first(5).join('\n')
    logger.error "*ERROR* Projections#index -> #{e}"
  end

  # GET /projections/1
  def show
    render json: @projection
  end

  # POST /projections
  def create
    @projection = Projection.new(projection_params)

    if @projection.save
      render json: @projection
    else
      render json: @projection.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /projections/1
  def update
    if @projection.update(projection_params)
      render json: @projection
    else
      render json: @projection.errors, status: :unprocessable_entity
    end
  end

  # DELETE /projections/1
  def destroy
    @projection.destroy
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_projection
    @projection = Projection.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def projection_params
    params.require(:projection).permit(:type)
  end

  def get_history(section, municipality, state, federalDistrict, level)
    parties = ["PAN","PCONV","PES","PH","PMC","PMOR","PNA","PPM","PRD","PRI","PSD","PSM","PT","PVEM"]
    result = nil
    case level
      when 'section'
        if section
          return Projection.where(section_code: section, state_code: State.find_state_by_name(state).state_code)
        end
      when 'municipality'
        if municipality
          state = State.find_state_by_name(state)
          result = Projection.where(muni_code: state.find_state_municipality(municipality).muni_code, state_code: state.state_code)
        end
      when 'district'
        if federalDistrict
          result = Projection.where(district_code: federalDistrict, state_code: State.find_state_by_name(state).state_code)
        end
      when 'state'
        if state
          result = StateCache.where(state_code: State.find_state_by_name(state).state_code).as_projection
        end
      when 'country'
        result = StateCache.allk.as_projection
    end

    return nil if !result

    groups = Hash.new
    result.each do |p|
      if !groups[[p.election_type, p.year]]
        groups[[p.election_type, p.year]] = p.dup
      else
        tmp = groups[[p.election_type, p.year]]
        parties.each do |party|
          tmp[party] += p[party]
        end
      end
    end
    return groups.values
  end
end
