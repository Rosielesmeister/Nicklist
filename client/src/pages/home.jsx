import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";
import { postsAPI } from "../api/api";
import PostCard from "../components/PostCard";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [regionFilter, setRegionFilter] = useState("");
    const [stateFilter, setStateFilter] = useState("");
    const [zipcodeFilter, setZipcodeFilter] = useState("");
    const [loading, setLoading] = useState(true);

    const categories = ['Electronics', 'Home Appliances', 'cars/trucks', 'Motorcycles', 'Bicycles', 'Real Estate', 'Fashion', 'Toys', 'Sports', 'health & Beauty', 'animals', 'Furniture', 'Clothing', 'Books', 'Services', 'Misc'];
    const regions = ["North", "South", "East", "West", "Central"];
    
    // US States array
    const states = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
        "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
        "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
        "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
        "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
        "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
        "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
        "Wisconsin", "Wyoming"
    ];

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await postsAPI.getAllPosts();
            setPosts(response.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPosts = posts.filter((post) => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !categoryFilter || post.category === categoryFilter;
        const matchesRegion = !regionFilter || post.region === regionFilter;
        const matchesState = !stateFilter || post.state === stateFilter;
        const matchesZipcode = !zipcodeFilter || 
            (post.zipcode && post.zipcode.toString().includes(zipcodeFilter));

        return matchesSearch && matchesCategory && matchesRegion && matchesState && matchesZipcode;
    });

    const clearFilters = () => {
        setSearchTerm("");
        setCategoryFilter("");
        setRegionFilter("");
        setStateFilter("");
        setZipcodeFilter("");
    };

    if (loading) {
        return (
            <div className="text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <Container>
            <Row>
                <Col>
                    <h1>Browse Listings</h1>
                    <Card className="mb-3">
                        <Card.Body>
                            <Row className="mb-3">
                                <Col md={6} lg={4}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search listings..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </Col>
                                <Col md={6} lg={4}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search by zipcode..."
                                        value={zipcodeFilter}
                                        onChange={(e) => setZipcodeFilter(e.target.value)}
                                    />
                                </Col>
                                <Col md={6} lg={4}>
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={clearFilters}
                                        className="w-100"
                                    >
                                        Clear Filters
                                    </Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6} lg={3}>
                                    <Form.Select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                <Col md={6} lg={3}>
                                    <Form.Select
                                        value={regionFilter}
                                        onChange={(e) => setRegionFilter(e.target.value)}
                                    >
                                        <option value="">All Regions</option>
                                        {regions.map((region) => (
                                            <option key={region} value={region}>
                                                {region}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                <Col md={6} lg={3}>
                                    <Form.Select
                                        value={stateFilter}
                                        onChange={(e) => setStateFilter(e.target.value)}
                                    >
                                        <option value="">All States</option>
                                        {states.map((state) => (
                                            <option key={state} value={state}>
                                                {state}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                <Col md={6} lg={3}>
                                    <div className="text-muted small">
                                        Showing {filteredPosts.length} of {posts.length} listings
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Row>
                        {filteredPosts.map((post) => (
                            <Col key={post._id} md={6} lg={4}>
                                <Card className="mb-3">
                                    {post.images && post.images.length > 0 && (
                                        <Card.Img variant="top" src={post.images[0].url} />
                                    )}
                                    <Card.Body>
                                        <Card.Title>{post.title}</Card.Title>
                                        <Card.Text>
                                            {post.description}
                                        </Card.Text>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <small className="text-muted">
                                                {post.state && `${post.state}`}
                                                {post.zipcode && ` ${post.zipcode}`}
                                            </small>
                                            <small className="text-muted">
                                                {post.category}
                                            </small>
                                        </div>
                                        <Button variant="primary">View Details</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {filteredPosts.length === 0 && (
                        <Row>
                            <Col className="text-center py-5">
                                <h4>No listings found</h4>
                                <p className="text-muted">Try adjusting your search filters</p>
                            </Col>
                        </Row>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Home;