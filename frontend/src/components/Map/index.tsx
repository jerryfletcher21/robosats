import React, { useContext, useEffect, useState } from 'react';
import { apiClient } from '../../services/api';
import { MapContainer, GeoJSON, useMapEvents, TileLayer, Tooltip, Marker } from 'react-leaflet';
import { useTheme, LinearProgress } from '@mui/material';
import { UseAppStoreType, AppContext } from '../../contexts/AppContext';
import { GeoJsonObject } from 'geojson';
import { Icon, LeafletMouseEvent, Point } from 'leaflet';
import { PublicOrder } from '../../models';
import OrderTooltip from '../Charts/helpers/OrderTooltip';
import getWorldmapGeojson from '../../geo/Web';

interface Props {
  orderType?: number;
  useTiles: boolean;
  position?: [number, number] | undefined;
  setPosition?: (position: [number, number]) => void;
  orders?: PublicOrder[];
  onOrderClicked?: (id: number) => void;
  zoom?: number;
  center?: [number, number];
  interactive?: boolean;
}

const Map = ({
  orderType,
  position,
  zoom,
  orders = [],
  setPosition = () => {},
  useTiles = false,
  onOrderClicked = () => null,
  center = [0, 0],
  interactive = false,
}: Props): JSX.Element => {
  const theme = useTheme();
  const { baseUrl } = useContext<UseAppStoreType>(AppContext);
  const [worldmap, setWorldmap] = useState<GeoJsonObject | undefined>();

  useEffect(() => {
    if (!worldmap) {
      getWorldmapGeojson(apiClient, baseUrl).then(setWorldmap);
    }
  }, []);

  const RobotMarker = (
    key: string | number,
    position: [number, number],
    orderType: number,
    order?: PublicOrder,
  ) => {
    const color = orderType == 1 ? 'Blue' : 'Lilac';
    const path =
      window.NativeRobosats === undefined
        ? '/static/assets'
        : 'file:///android_asset/Web.bundle/assets';

    return (
      <Marker
        key={key}
        position={position}
        icon={
          new Icon({
            iconUrl: `${path}/vector/Location_robot_${color}.svg`,
            iconAnchor: [18, 32],
            iconSize: [32, 32],
          })
        }
        eventHandlers={{
          click: (_event: LeafletMouseEvent) => order?.id && onOrderClicked(order.id),
        }}
      >
        {order && (
          <Tooltip direction='top'>
            <OrderTooltip order={order} />
          </Tooltip>
        )}
      </Marker>
    );
  };

  const LocationMarker = () => {
    useMapEvents({
      click(event: LeafletMouseEvent) {
        if (interactive) {
          setPosition([event.latlng.lat, event.latlng.lng]);
        }
      },
    });

    return position ? RobotMarker('marker', position, orderType || 0) : <></>;
  };

  const getOrderMarkers = () => {
    return orders.map((order) => {
      if (!order.latitude || !order.longitude) return <></>;
      return RobotMarker(order.id, [order.latitude, order.longitude], order.type || 0, order);
    });
  };

  return (
    <MapContainer
      center={center ?? [0, 0]}
      zoom={zoom ? zoom : 2}
      attributionControl={false}
      style={{ height: '100%', width: '100%', backgroundColor: theme.palette.background.paper }}
    >
      {!useTiles && !worldmap && <LinearProgress />}
      {!useTiles && worldmap && (
        <GeoJSON
          data={worldmap}
          style={{
            weight: 1,
            fillColor: theme.palette.text.disabled,
            color: theme.palette.text.secondary,
          }}
        />
      )}
      {useTiles && (
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          referrerPolicy='no-referrer'
        />
      )}
      {getOrderMarkers()}
      <LocationMarker />
    </MapContainer>
  );
};

export default Map;