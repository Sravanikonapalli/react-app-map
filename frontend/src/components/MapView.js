import React from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../styles/mapview.css"; 
import { Link } from "react-router-dom";
import { IoMdArrowDropleftCircle } from "react-icons/io";

class MapView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            map: null,
            loading: true, 
        };
        this.mapContainerRef = React.createRef(); 
    }

    componentDidMount() {
        this.fetchCoordinates();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location !== this.props.location) {
            if (this.state.map) {
                this.state.map.remove();
            }
            this.setState({ map: null, loading: true }, () => {
                this.fetchCoordinates();
            });
        }
    }

    componentWillUnmount() {
        if (this.state.map) {
            this.state.map.remove();
        }
    }

    fetchCoordinates = async () => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${this.props.location}&format=json`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];

                if (this.state.map) {
                    this.state.map.setView([lat, lon], 13);
                    L.marker([lat, lon]).addTo(this.state.map);
                } else {
                    const newMap = L.map(this.mapContainerRef.current).setView([lat, lon], 13);
                    L.tileLayer(
                        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                        {
                            attribution:
                                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                        }
                    ).addTo(newMap);
                    L.marker([lat, lon]).addTo(newMap);
                    this.setState({ map: newMap, loading: false });
                }
            } else {
                console.error("Location not found");
                this.setState({ loading: false });
            }
        } catch (error) {
            console.error("Error fetching location:", error);
            this.setState({ loading: false });
        }
    };

    render() {
        return (
            <div className="map-view-container">
                <Link to="/" className="back-icon"><IoMdArrowDropleftCircle size={40}/></Link>
                <h2>Map View</h2>
                {this.state.loading && <p className="loading-message">Loading map...</p>}
                <div ref={this.mapContainerRef} className="map-container"></div>
            </div>
        );
    }
}

export default MapView;