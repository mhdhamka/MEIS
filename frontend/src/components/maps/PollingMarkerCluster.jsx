import { Marker, Popup } from "react-leaflet";

export default function PollingMarkerCluster({ onSelectHub }) {
  const hubs = [
    { id: 1, name: "Petra Jaya Hub", coords: [1.5533, 110.3592], electorate: 85000 },
    { id: 2, name: "Stampin District Center", coords: [1.5076, 110.3458], electorate: 120000 },
  ];

  return (
    <>
      {hubs.map((hub) => (
        <Marker
          key={hub.id}
          position={hub.coords}
          eventHandlers={{
            click: () => onSelectHub && onSelectHub(hub),
          }}
        >
          <Popup>
            <div className="p-1">
              <h5 className="text-xs font-bold text-slate-900">{hub.name}</h5>
              <p className="text-[11px] text-slate-600">Voters: {hub.electorate.toLocaleString()}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}