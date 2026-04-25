import { CheckCircle, Clock, ExternalLink, Globe, MessageCircle, UserCheck } from 'lucide-react'

import StatusBadge from '../components/StatusBadge'
import { dayjs } from '../utils'

function DetailRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--admin-text-subtle)]" strokeWidth={1.8} />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--admin-text-subtle)]">{label}</p>
        <div className="mt-0.5 text-sm text-[var(--admin-text-muted)]">{children}</div>
      </div>
    </div>
  )
}

function getSessionLabel(sessionId) {
  if (!sessionId) {
    return 'Phiên mới'
  }

  return `#${sessionId.slice(-8).toUpperCase()}`
}

export default function AdminChatDetailsPane({
  assigning,
  isAssignedToMe,
  isResolved,
  messages,
  resolving,
  selectedConversation,
  onAssign,
  onResolve
}) {
  if (!selectedConversation) {
    return null
  }

  const customerName = selectedConversation.customer?.name || 'Khách ẩn danh'
  const currentPage = selectedConversation.customer?.currentPage

  return (
    <aside className="hidden h-full w-[280px] shrink-0 overflow-y-auto border-l border-[var(--admin-border)] bg-[var(--admin-surface)] xl:block">
      <div className="border-b border-[var(--admin-border)] px-5 py-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--admin-surface-2)] text-xl font-semibold text-[var(--admin-text)]">
          {customerName[0].toUpperCase()}
        </div>
        <p className="font-semibold text-[var(--admin-text)]">{customerName}</p>
        <p className="mt-1 font-mono text-xs text-[var(--admin-text-subtle)]">{getSessionLabel(selectedConversation.sessionId)}</p>
        <div className="mt-3">
          <StatusBadge status={selectedConversation.status} />
        </div>
      </div>

      <div className="space-y-5 p-5">
        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--admin-text-subtle)]">
            Thông tin hội thoại
          </p>

          <div className="space-y-4">
            <DetailRow icon={Clock} label="Bắt đầu">
              {dayjs(selectedConversation.createdAt).format('DD/MM/YYYY HH:mm')}
            </DetailRow>

            {selectedConversation.firstReplyAt && (
              <DetailRow icon={CheckCircle} label="Phản hồi đầu tiên">
                {dayjs(selectedConversation.firstReplyAt).format('DD/MM/YYYY HH:mm')}
              </DetailRow>
            )}

            <DetailRow icon={MessageCircle} label="Số tin nhắn">
              {selectedConversation.messageCount || messages.length}
            </DetailRow>

            {currentPage && (
              <DetailRow icon={Globe} label="Trang hiện tại">
                <a
                  href={currentPage}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex max-w-full items-center gap-1 text-xs text-[var(--admin-text-muted)] transition-colors hover:text-[var(--admin-text)]"
                  title={currentPage}
                >
                  <span className="line-clamp-2 break-all">{currentPage}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" strokeWidth={1.8} />
                </a>
              </DetailRow>
            )}
          </div>
        </section>

        <section className="border-t border-[var(--admin-border)] pt-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--admin-text-subtle)]">
            Agent phụ trách
          </p>

          {selectedConversation.assignedAgent?.agentName ? (
            <div className="flex items-center gap-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--admin-accent)] text-sm font-semibold text-[#f4f5f8]">
                {selectedConversation.assignedAgent.agentName[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[var(--admin-text)]">
                  {selectedConversation.assignedAgent.agentName}
                </p>
                <p className="text-xs text-[var(--admin-text-muted)]">
                  {dayjs(selectedConversation.assignedAgent.assignedAt).fromNow()}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-dashed border-[var(--admin-border-strong)] bg-[var(--admin-surface-2)] p-3 text-[var(--admin-text-muted)]">
              <UserCheck className="h-4 w-4" strokeWidth={1.8} />
              <span className="text-sm">Chưa được phân công</span>
            </div>
          )}
        </section>

        {!isResolved && (
          <section className="space-y-2 border-t border-[var(--admin-border)] pt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--admin-text-subtle)]">
              Hành động nhanh
            </p>

            {selectedConversation.status === 'unassigned' && (
              <button
                type="button"
                onClick={onAssign}
                disabled={assigning}
                className="flex w-full items-center gap-2 rounded-lg bg-[var(--admin-accent)] px-3 py-2.5 text-left text-sm font-medium text-[#f4f5f8] transition-colors hover:bg-[color-mix(in_srgb,var(--admin-accent)_88%,#000000)] disabled:cursor-wait disabled:opacity-70"
              >
                <UserCheck className="h-4 w-4" strokeWidth={1.8} />
                {assigning ? 'Đang nhận cuộc trò chuyện' : 'Nhận cuộc trò chuyện'}
              </button>
            )}

            {isAssignedToMe && (
              <button
                type="button"
                onClick={onResolve}
                disabled={resolving}
                className="flex w-full items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2.5 text-left text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-70"
              >
                <CheckCircle className="h-4 w-4" strokeWidth={1.8} />
                {resolving ? 'Đang lưu trạng thái' : 'Đánh dấu đã giải quyết'}
              </button>
            )}
          </section>
        )}
      </div>
    </aside>
  )
}
