'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Star8, OrnamentDivider } from '@/components/ui/GoldOrnament';
import ImageAvatar from '@/components/ui/ImageAvatar';

export interface Comment {
  _id?: string;
  authorName: string;
  authorEmail?: string;
  authorUserId?: string;
  message: string;
  createdAt: string;
  type?: 'accept' | 'counter';
  counterTime?: string;
  counterTopic?: string;
  counterVenue?: string;
}

interface Props {
  title: string;
  subtitle?: string;
  content?: string;
  image?: string;
  comments: Comment[];
  accentColor?: string;
  isAdmin?: boolean;
  onSubmit: (payload: {
    authorName: string;
    authorEmail?: string;
    message: string;
  }) => Promise<boolean | void>;
  onDelete?: (commentId: string) => Promise<boolean | void>;
  onClose: () => void;
}

export default function CommentDialog({
  title,
  subtitle,
  content,
  image,
  comments,
  accentColor = '#D6B46A',
  isAdmin = false,
  onSubmit,
  onDelete,
  onClose,
}: Props) {
  const { data: session } = useSession();
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [posted, setPosted] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const user = session?.user;
  const userEmail = user?.email || '';
  const isSignedIn = !!userEmail;

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [comments.length]);

  async function submit() {
    if (!isSignedIn) return;
    if (!message.trim()) return;
    setBusy(true);
    setError('');
    try {
      const ok = await onSubmit({
        authorName: user?.name || 'Anonymous',
        authorEmail: user?.email || undefined,
        message: message.trim(),
      });
      if (ok !== false) {
        setMessage('');
        setPosted(true);
        setTimeout(() => setPosted(false), 2000);
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to send');
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!confirmingId || !onDelete) return;
    setDeletingId(confirmingId);
    try {
      const ok = await onDelete(confirmingId);
      if (ok !== false) setConfirmingId(null);
    } catch (e: any) {
      setError(e?.message || 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-midnight/90 backdrop-blur-md sm:items-center sm:px-4 sm:pb-4">
      <div
        className="flex w-full max-w-[480px] flex-col overflow-hidden sm:rounded-[28px]"
        style={{
          height: '92vh',
          background:
            'linear-gradient(160deg, #0A4139 0%, #062E2A 55%, #031A18 100%)',
          border: '1px solid rgba(214,180,106,0.22)',
          boxShadow: '0 -30px 60px -20px rgba(0,0,0,0.6)',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-line-dark px-4 py-3">
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full glass-dark press"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-on-dark)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div className="flex-1 text-center">
            <div className="kicker kicker-gold">Responses</div>
          </div>
          <Star8 size={14} />
        </div>

        {/* Scrollable content */}
        <div ref={listRef} className="flex-1 overflow-y-auto">
          {/* Original item */}
          <div className="border-b border-line-dark px-4 py-4">
            {image && (
              <div className="relative mb-4 h-[140px] overflow-hidden rounded-[18px]">
                <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(3,26,24,0.10) 0%, rgba(6,46,42,0.85) 100%)' }} />
              </div>
            )}
            <div className="font-display text-[18px] font-semibold leading-tight text-ink-on-dark">
              {title}
            </div>
            {subtitle && (
              <div className="mt-1 text-[11.5px] text-ink-faint">{subtitle}</div>
            )}
            {content && (
              <div className="mt-3 whitespace-pre-wrap text-[13.5px] leading-[1.6] text-ink-soft">
                {content}
              </div>
            )}
            <div className="mt-4">
              <OrnamentDivider width="100%" />
            </div>
          </div>

          {/* Comments list */}
          <div className="px-4 py-4">
            {comments.length === 0 ? (
              <div className="rounded-[18px] border border-dashed border-line-dark p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full glass-gold">
                  <Star8 size={18} />
                </div>
                <div className="mt-3 font-display text-[14px] font-semibold text-ink-on-dark">
                  No responses yet
                </div>
                <div className="mt-1 text-[11.5px] text-ink-faint">
                  Be the first to respond
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {comments.map((c, i) => {
                  const canDelete =
                    !!onDelete &&
                    !!c._id &&
                    (isAdmin || !!(userEmail && c.authorEmail === userEmail));
                  return (
                    <CommentRow
                      key={c._id || i}
                      comment={c}
                      accentColor={accentColor}
                      canDelete={canDelete}
                      onDeleteClick={() => setConfirmingId(c._id || null)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Reply input */}
        <div
          className="border-t border-line-dark p-3"
          style={{
            background:
              'linear-gradient(180deg, rgba(6,46,42,0.95) 0%, rgba(3,26,24,0.98) 100%)',
          }}
        >
          {!isSignedIn ? (
            <button
              onClick={() => signIn('google')}
              className="press flex w-full items-center justify-center gap-2 rounded-pill bg-champagne py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-midnight"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Sign in to reply
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <ImageAvatar src={user?.image} name={user?.name || ''} size={36} ring={false} />
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    submit();
                  }
                }}
                placeholder="Write a response…"
                disabled={busy}
                className="flex-1 rounded-pill border border-line-dark bg-white/5 px-4 py-3 text-[13.5px] text-ink-on-dark outline-none focus:border-champagne disabled:opacity-50"
              />
              <button
                onClick={submit}
                disabled={busy || !message.trim()}
                className="press flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full disabled:opacity-40"
                style={{
                  background:
                    'linear-gradient(160deg, #E5B437 0%, #C9A227 55%, #8A6B15 100%)',
                  boxShadow: '0 4px 12px -4px rgba(201,162,39,0.5)',
                }}
                aria-label="Send"
              >
                {busy ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#031A18" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#031A18" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-2 rounded-[10px] bg-error-soft px-3 py-2 text-center text-[11px] text-error">
              {error}
            </div>
          )}
          {posted && (
            <div className="mt-2 rounded-[10px] bg-champagne/15 px-3 py-2 text-center text-[11px] text-champagne">
              ✓ Response sent
            </div>
          )}
        </div>
      </div>

      {/* Confirm delete modal */}
      {confirmingId && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-midnight/90 px-5 backdrop-blur-md">
          <div className="glass-dark-strong w-full max-w-[360px] rounded-[26px] p-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full" style={{ background: 'rgba(168,70,70,0.20)', border: '1px solid rgba(168,70,70,0.4)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E8A8A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
              </svg>
            </div>
            <div className="mt-4 font-display text-[17px] font-semibold text-ink-on-dark">Delete this response?</div>
            <div className="mt-2 text-[12px] text-ink-soft">This action cannot be undone.</div>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setConfirmingId(null)}
                disabled={!!deletingId}
                className="glass-dark press flex-1 rounded-pill py-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink-soft"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={!!deletingId}
                className="press flex-1 rounded-pill py-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-white disabled:opacity-50"
                style={{ background: 'linear-gradient(160deg, #C25B5B 0%, #A84646 55%, #7A2C2C 100%)' }}
              >
                {deletingId ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CommentRow({
  comment,
  accentColor,
  canDelete,
  onDeleteClick,
}: {
  comment: Comment;
  accentColor: string;
  canDelete: boolean;
  onDeleteClick: () => void;
}) {

  const initials = comment.authorName?.[0]?.toUpperCase() || '·';

  const typeBadge = comment.type === 'accept'
    ? { label: 'Accepted', color: '#789B8A' }
    : comment.type === 'counter'
    ? { label: 'Counter-proposed', color: '#D6B46A' }
    : null;

  return (
    <div className="flex items-start gap-3">
      <div
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full font-display text-[13px] font-semibold text-midnight"
        style={{ background: accentColor }}
      >
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="rounded-[16px] border border-line-dark bg-white/[0.03] px-3.5 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="truncate font-display text-[12.5px] font-semibold text-ink-on-dark">
                {comment.authorName}
              </span>
              {typeBadge && (
                <span
                  className="rounded-pill px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-[0.12em]"
                  style={{ background: `${typeBadge.color}22`, color: typeBadge.color }}
                >
                  {typeBadge.label}
                </span>
              )}
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              <span className="text-[10px] text-ink-faint">
                {new Date(comment.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </span>
              {canDelete && (
                <button
                  onClick={onDeleteClick}
                  className="press flex h-6 w-6 items-center justify-center rounded-full"
                  style={{ background: 'rgba(168,70,70,0.20)' }}
                  aria-label="Delete"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#E8A8A8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="mt-1.5 whitespace-pre-wrap text-[13px] leading-[1.55] text-ink-soft">
            {comment.message}
          </div>
          {comment.counterTime && (
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-champagne">
              <span>🕐</span>
              <span>{comment.counterTime}</span>
              {comment.counterVenue && (
                <>
                  <span className="text-ink-faint">·</span>
                  <span>{comment.counterVenue}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}