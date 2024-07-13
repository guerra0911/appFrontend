import { useState, useEffect } from 'react';
import api from '../api';
import { useGlobalContext } from '../context/GlobalProvider';

const usePostActions = (post, onLikeDislikeUpdate) => {
  const { user, posts, setPosts } = useGlobalContext();
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [dislikeCount, setDislikeCount] = useState(post.dislikes.length);
  const [likedBy, setLikedBy] = useState([]);
  const [dislikedBy, setDislikedBy] = useState([]);
  const [likeDislikeModalVisible, setLikeDislikeModalVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [likeDislikeModalTitle, setLikeDislikeModalTitle] = useState('');
  const [formType, setFormType] = useState(null);

  const updatePostLikesDislikes = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
  };

  const handleLike = async () => {
    try {
      const response = await api.post(`/api/notes/${post.id}/like/`);
      setLikeCount(response.data.likes);
      setDislikeCount(response.data.dislikes);
      updatePostLikesDislikes(response.data);
      onLikeDislikeUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDislike = async () => {
    try {
      const response = await api.post(`/api/notes/${post.id}/dislike/`);
      setLikeCount(response.data.likes);
      setDislikeCount(response.data.dislikes);
      updatePostLikesDislikes(response.data);
      onLikeDislikeUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLikedBy = async () => {
    try {
      const response = await api.get(`/api/notes/${post.id}/liked_by/`);
      setLikedBy(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDislikedBy = async () => {
    try {
      const response = await api.get(`/api/notes/${post.id}/disliked_by/`);
      setDislikedBy(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const openLikedByModal = () => {
    setLikeDislikeModalTitle('Liked By');
    fetchLikedBy();
    setLikeDislikeModalVisible(true);
  };

  const openDislikedByModal = () => {
    setLikeDislikeModalTitle('Disliked By');
    fetchDislikedBy();
    setLikeDislikeModalVisible(true);
  };

  const openChallengeForm = () => {
    setFormType('challenge');
    setFormModalVisible(true);
  };

  const openSubForm = () => {
    setFormType('sub');
    setFormModalVisible(true);
  };

  return {
    user,
    likeCount,
    dislikeCount,
    likedBy,
    dislikedBy,
    likeDislikeModalVisible,
    setLikeDislikeModalVisible,
    formModalVisible,
    setFormModalVisible,
    likeDislikeModalTitle,
    formType,
    setFormType,
    handleLike,
    handleDislike,
    openLikedByModal,
    openDislikedByModal,
    openChallengeForm,
    openSubForm,
  };
};

export default usePostActions;
