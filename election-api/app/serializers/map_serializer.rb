class MapSerializer < ActiveModel::Serializer
  attributes :id, :name, :url, :map_scope, :lat, :long, :scale
end
