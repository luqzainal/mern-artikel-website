import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Card,
  CardBody,
  Avatar,
  Button,
  Textarea,
  Spinner,
  Divider,
} from '@nextui-org/react'
import { FiSend } from 'react-icons/fi'
import { getCommentsByArticle, createComment } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from './LanguageToggle'

interface CommentSectionProps {
  articleId: string
}

export default function CommentSection({ articleId }: CommentSectionProps) {
  const { user } = useAuth()
  const { language } = useLanguage()
  const [commentText, setCommentText] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const queryClient = useQueryClient()

  const { data: commentsData, isLoading } = useQuery({
    queryKey: ['comments', articleId],
    queryFn: () => getCommentsByArticle(articleId),
  })

  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] })
      setCommentText('')
      setReplyText('')
      setReplyingTo(null)
    },
  })

  const handleSubmitComment = () => {
    if (!commentText.trim()) return
    createCommentMutation.mutate({
      articleId,
      content: commentText,
    })
  }

  const handleSubmitReply = (parentId: string) => {
    if (!replyText.trim()) return
    createCommentMutation.mutate({
      articleId,
      content: replyText,
      parentId,
    })
  }

  const comments = commentsData?.data || []

  return (
    <Card>
      <CardBody className="p-8">
        <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {language === 'EN' ? 'Comments' : 'Komen'} ({comments.length})
        </h3>

        {/* Comment Form */}
        {user ? (
          <div className="mb-8">
            <div className="flex gap-4">
              <Avatar name={user.name} src={user.profilePicture} />
              <div className="flex-1">
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={
                    language === 'EN'
                      ? 'Share your thoughts...'
                      : 'Kongsikan pendapat anda...'
                  }
                  minRows={3}
                  className="mb-2"
                />
                <div className="flex justify-end">
                  <Button
                    color="primary"
                    endContent={<FiSend />}
                    onClick={handleSubmitComment}
                    isLoading={createCommentMutation.isPending}
                    isDisabled={!commentText.trim()}
                  >
                    {language === 'EN' ? 'Post Comment' : 'Hantar Komen'}
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2 ml-14">
              {language === 'EN'
                ? 'Your comment will be reviewed before being published.'
                : 'Komen anda akan disemak sebelum diterbitkan.'}
            </p>
          </div>
        ) : (
          <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'EN'
                ? 'Please sign in to leave a comment'
                : 'Sila log masuk untuk meninggalkan komen'}
            </p>
          </div>
        )}

        <Divider className="my-6" />

        {/* Comments List */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {language === 'EN'
              ? 'No comments yet. Be the first to comment!'
              : 'Tiada komen lagi. Jadilah yang pertama untuk komen!'}
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment: any) => (
              <div key={comment.id}>
                {/* Main Comment */}
                <div className="flex gap-4">
                  <Avatar
                    name={comment.user.name}
                    src={comment.user.profilePicture}
                    size="sm"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {comment.user.name}
                        </p>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                    </div>
                    {user && (
                      <Button
                        size="sm"
                        variant="light"
                        className="mt-2"
                        onClick={() => setReplyingTo(comment.id)}
                      >
                        {language === 'EN' ? 'Reply' : 'Balas'}
                      </Button>
                    )}

                    {/* Reply Form */}
                    {replyingTo === comment.id && (
                      <div className="mt-4 ml-8">
                        <Textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={language === 'EN' ? 'Write a reply...' : 'Tulis balasan...'}
                          minRows={2}
                          className="mb-2"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            color="primary"
                            onClick={() => handleSubmitReply(comment.id)}
                            isLoading={createCommentMutation.isPending}
                          >
                            {language === 'EN' ? 'Reply' : 'Balas'}
                          </Button>
                          <Button
                            size="sm"
                            variant="light"
                            onClick={() => {
                              setReplyingTo(null)
                              setReplyText('')
                            }}
                          >
                            {language === 'EN' ? 'Cancel' : 'Batal'}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 ml-8 space-y-4">
                        {comment.replies.map((reply: any) => (
                          <div key={reply.id} className="flex gap-3">
                            <Avatar
                              name={reply.user.name}
                              src={reply.user.profilePicture}
                              size="sm"
                            />
                            <div className="flex-1">
                              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                <div className="flex justify-between items-start mb-1">
                                  <p className="font-semibold text-sm text-gray-900 dark:text-white">
                                    {reply.user.name}
                                  </p>
                                  <span className="text-xs text-gray-500">
                                    {new Date(reply.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  {reply.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  )
}
