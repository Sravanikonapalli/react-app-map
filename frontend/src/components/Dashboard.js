import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';

const dummyData = [
    { id: 1, title: "Card 1", description: "Description for Bangalore.", location: "Bangalore" },
    { id: 2, title: "Card 2", description: "Description for Hyderabad.", location: "Hyderabad" },
    { id: 3, title: "Card 3", description: "Description for Mumbai.", location: "Mumbai" },
    { id: 4, title: "Card 4", description: "Description for Chennai.", location: "Chennai" },
    { id: 5, title: "Card 5", description: "Description for Maharashtra.", location: "Maharashtra" },
];

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: [],
            error: null,
            loading: true,
            isLoggedIn: !!localStorage.getItem("token"),
        };
    }

    componentDidMount() {
        if (this.state.isLoggedIn) {
            this.setState({
                cards: dummyData,
                loading: false,
            });
        } else {
            this.setState({ loading: false });
        }
    }

    render() {
        const { cards, error, loading, isLoggedIn } = this.state;

        if (loading) {
            return <div className="loading">Loading...</div>;
        }

        if (!isLoggedIn) {
            return (
                <div className="dashboard-container">
                    <p className="dashboard-error">USER NOT LOGGED IN</p>
                    <p className="dashboard-error">Please log in to view the dashboard.</p>
                </div>
            );
        }

        return (
            <div className="dashboard-container">
                <h2 className="dashboard-title">Dashboard</h2>
                {error && <p className="dashboard-error">{error}</p>}
                <div className="cards-container">
                    {cards.map((card) => (
                        <div key={card.id} className="card">
                            <h3 className="card-title">{card.title}</h3>
                            <p className="card-description">{card.description}</p>
                            <p className="card-location">Location: {card.location}</p>
                            <Link to={`/map/${card.location}`} className="card-link">
                                View on Map
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Dashboard;
