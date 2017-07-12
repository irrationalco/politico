class Api::V1::ProjectionsController < ApplicationController
  before_action :set_projection, only: [:show, :update, :destroy]

  # GET /projections
  def index
    ############################################################################
    # Borrar esta parte cuando ya no la necesites, tambien borrar esos archivos
    file = File.join(Rails.root, 'muniCodes.json')
    filedata = File.read(file)
    munis = JSON.parse(filedata)

    file = File.join(Rails.root, 'stateCodes.json')
    filedata = File.read(file)
    states = JSON.parse(filedata)
    ##############################################################################

    if params["history"].present?
      @projections = get_history(params['section'],
                                params["municipality"],
                                params["state"],
                                params["federalDistrict"],
                                params['level'],
                                states, munis).map.with_index {|p, i| p[:id] = i
                                                                      p}
    elsif needed_params_present?("state", "municipality")
      state = State.find_state_by_name(params["state"])
      muni = State.find_state_municipality(params["municipality"], state)
      @projections = Projection.all.municipal(state.state_code, muni.muni_code)
    elsif needed_params_present?("state", "federalDistrict")
      state = State.find_state_by_name(params["state"])
      @projections = Projection.all.distrital(state.state_code, params["federalDistrict"])
    end

    if @projections.present?
      render json: @projections
    else
      @projections = Projection.where(id: 1)
      render json: @projections
    end
  rescue State::DataNotFound => e
    puts e.message
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
    
    # Function to make params check more explicit
    def needed_params_present?(*ar_params)
      ar_params.flatten.all? { |e| params[e].present? }
    end

    def get_history(section, municipality, state, federalDistrict, level, states, munis)
      parties = ["PAN","PCONV","PES","PH","PMC","PMOR","PNA","PPM","PRD","PRI","PSD","PSM","PT","PVEM"]
      result = nil
      case level
        when 'section'
          if section
            return Projection.where(section_code: section, state_code: states[state])
          end
        when 'municipality'
          if municipality
            result = Projection.where(muni_code: munis[municipality], state_code: states[state])
          end
        when 'district'
          if federalDistrict
            result = Projection.where(district_code: federalDistrict, state_code: states[state])
          end
        when 'state'
          if state
            result = Projection.where(state_code: states[state])
          end
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
