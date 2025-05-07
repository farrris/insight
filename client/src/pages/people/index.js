import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../constants";
import { Image, Button, Form, Card, Container } from "react-bootstrap";
import defaultAvatar from "../../assets/default-avatar.png";

function People() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    //fetchPosts();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users/${userId}`);
      setUser(response.data);
      setIsFavorite(response.data.is_favorite);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      navigate("/peoples");
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/posts/?user_id=${userId}`);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await axios.delete(`${API_URL}/api/favorites/${userId}`);
      } else {
        await axios.post(`${API_URL}/api/favorites/?user_id=${userId}`);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const createPost = async () => {
    try {
      await axios.post(`${API_URL}/api/posts/`, {
        content: newPostContent,
        user_id: userId
      });
      setNewPostContent("");
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <Container className="my-4">
      <div className="profile-header mb-4">
        <div className="d-flex align-items-center">
          {user.avatar ? (
            <Image
              src={`${API_URL}${user.avatar}`}
              roundedCircle
              className="me-4"
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
            />
          ) : (
            <Image
              src={defaultAvatar}
              roundedCircle
              className="me-4"
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
            />
          )}
          <div>
            <h2>{user.name} {user.surname}</h2>
            <p className="text-muted">{user.city}, {user.age} лет</p>
          </div>
        </div>

        <div className="profile-actions mt-3">
          <Button
            variant={isFavorite ? "warning" : "outline-primary"}
            className="me-2"
            onClick={toggleFavorite}
          >
            {isFavorite ? "★ В избранном" : "☆ Добавить в избранное"}
          </Button>
          <Button variant="primary">Написать сообщение</Button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Информация</Card.Title>
              <div className="mb-2">
                <strong>Пол:</strong> {user.gender}
              </div>
              <div className="mb-2">
                <strong>Город:</strong> {user.city}
              </div>
              <div className="mb-2">
                <strong>Возраст:</strong> {user.age}
              </div>

              <Card.Title className="mt-3">Интересы</Card.Title>
              <div className="d-flex flex-wrap gap-2">
                {user.interests.map(interest => (
                  <span key={interest.id} className="badge bg-primary">
                    {interest.title}
                  </span>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-8">
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>О себе</Card.Title>
              <p>{user.about || "Пользователь пока ничего не написал о себе."}</p>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Создать пост</Card.Title>
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Напишите что-нибудь..."
                />
              </Form.Group>
              <Button
                variant="primary"
                onClick={createPost}
                disabled={!newPostContent.trim()}
              >
                Опубликовать
              </Button>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <Card.Title>Посты</Card.Title>
              {posts.length > 0 ? (
                posts.map(post => (
                  <Card key={post.id} className="mb-3">
                    <Card.Body>
                      <div className="d-flex justify-content-between mb-2">
                        <small className="text-muted">
                          {new Date(post.created_at).toLocaleString()}
                        </small>
                      </div>
                      <p>{post.content}</p>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p>Пока нет постов</p>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default People;