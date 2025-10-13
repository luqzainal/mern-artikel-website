import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tabs,
  Tab,
  Chip,
} from '@nextui-org/react';
import { Calendar, User, Tag, Globe } from 'lucide-react';
import { Article } from '../../types';
import { formatDate } from '../../utils/helpers';
import ArticleStatusBadge from './ArticleStatusBadge';

interface ArticlePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
}

export default function ArticlePreview({ isOpen, onClose, article }: ArticlePreviewProps) {
  if (!article) return null;

  const msTranslation = article.translations?.find((t) => t.langCode === 'ms');
  const enTranslation = article.translations?.find((t) => t.langCode === 'en');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Article Preview</h2>
                <ArticleStatusBadge status={article.status} size="md" />
              </div>
            </ModalHeader>

            <ModalBody>
              {/* Article Meta Info */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Author</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {article.author?.name || 'Unknown'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatDate(article.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Category</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {article.category?.name || '-'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Views</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {article.views.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Tabs */}
              <Tabs aria-label="Language tabs" color="primary">
                <Tab
                  key="ms"
                  title={
                    <div className="flex items-center gap-2">
                      <span>🇲🇾</span>
                      <span>Bahasa Melayu</span>
                    </div>
                  }
                >
                  {msTranslation ? (
                    <div className="space-y-4 py-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {msTranslation.title}
                        </h3>
                        {msTranslation.excerpt && (
                          <p className="text-gray-600 dark:text-gray-400 italic">
                            {msTranslation.excerpt}
                          </p>
                        )}
                      </div>

                      <div
                        className="prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: msTranslation.content }}
                      />

                      {/* References */}
                      {msTranslation.references && msTranslation.references.length > 0 && (
                        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                            References
                          </h4>
                          <ul className="space-y-2">
                            {msTranslation.references.map((ref, idx) => (
                              <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                                <span className="font-medium">{ref.type}:</span> {ref.text}
                                {ref.citation && (
                                  <span className="text-gray-500"> ({ref.citation})</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">
                        No Malay translation available
                      </p>
                    </div>
                  )}
                </Tab>

                <Tab
                  key="en"
                  title={
                    <div className="flex items-center gap-2">
                      <span>🇬🇧</span>
                      <span>English</span>
                    </div>
                  }
                >
                  {enTranslation ? (
                    <div className="space-y-4 py-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {enTranslation.title}
                        </h3>
                        {enTranslation.excerpt && (
                          <p className="text-gray-600 dark:text-gray-400 italic">
                            {enTranslation.excerpt}
                          </p>
                        )}
                      </div>

                      <div
                        className="prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: enTranslation.content }}
                      />

                      {/* References */}
                      {enTranslation.references && enTranslation.references.length > 0 && (
                        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                            References
                          </h4>
                          <ul className="space-y-2">
                            {enTranslation.references.map((ref, idx) => (
                              <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                                <span className="font-medium">{ref.type}:</span> {ref.text}
                                {ref.citation && (
                                  <span className="text-gray-500"> ({ref.citation})</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">
                        No English translation available
                      </p>
                    </div>
                  )}
                </Tab>
              </Tabs>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Chip key={tag.id} size="sm" variant="flat">
                        {tag.name}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              <Button color="default" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                onPress={() => window.open(`/preview/${article.id}`, '_blank')}
              >
                Open in New Tab
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

