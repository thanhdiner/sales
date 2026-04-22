import { useAdminChatPage } from './hooks/useAdminChatPage'
import AdminChatConversationPane from './sections/AdminChatConversationPane'
import AdminChatDetailsPane from './sections/AdminChatDetailsPane'
import AdminChatEmptyState from './sections/AdminChatEmptyState'
import AdminChatSidebar from './sections/AdminChatSidebar'

export default function AdminChatPage() {
  const {
    activeTab,
    canSend,
    counts,
    customerTyping,
    filteredConversations,
    input,
    inputRef,
    imageInputRef,
    isAssignedToMe,
    isNote,
    isResolved,
    isUploadingImage,
    messages,
    messagesViewportRef,
    pendingImage,
    searchQuery,
    selectedConversation,
    selectedSession,
    clearPendingImage,
    handleAssign,
    handleBackToList,
    handleComposerChange,
    handleImageChange,
    handleKeyDown,
    handleRefresh,
    handleResolve,
    handleSearchChange,
    handleSelectConversation,
    handleTabChange,
    openImagePicker,
    sendReply,
    switchToNoteMode,
    switchToReplyMode
  } = useAdminChatPage()

  return (
    <div className="relative flex h-full overflow-hidden bg-white dark:bg-gray-900">
      <AdminChatSidebar
        activeTab={activeTab}
        counts={counts}
        filteredConversations={filteredConversations}
        searchQuery={searchQuery}
        selectedSession={selectedSession}
        showChatPane={!!selectedSession}
        onRefresh={handleRefresh}
        onSearchChange={handleSearchChange}
        onSelectConversation={handleSelectConversation}
        onTabChange={handleTabChange}
      />

      {selectedSession ? (
        <AdminChatConversationPane
          canSend={canSend}
          customerTyping={customerTyping}
          input={input}
          inputRef={inputRef}
          imageInputRef={imageInputRef}
          isAssignedToMe={isAssignedToMe}
          isNote={isNote}
          isResolved={isResolved}
          isUploadingImage={isUploadingImage}
          messages={messages}
          messagesViewportRef={messagesViewportRef}
          pendingImage={pendingImage}
          selectedConversation={selectedConversation}
          onAssign={handleAssign}
          onBackToList={handleBackToList}
          onClearPendingImage={clearPendingImage}
          onComposerChange={handleComposerChange}
          onImageChange={handleImageChange}
          onKeyDown={handleKeyDown}
          onOpenImagePicker={openImagePicker}
          onResolve={handleResolve}
          onSendReply={sendReply}
          onSwitchToNoteMode={switchToNoteMode}
          onSwitchToReplyMode={switchToReplyMode}
        />
      ) : (
        <AdminChatEmptyState />
      )}

      <AdminChatDetailsPane
        isAssignedToMe={isAssignedToMe}
        isResolved={isResolved}
        messages={messages}
        selectedConversation={selectedConversation}
        onAssign={handleAssign}
        onResolve={handleResolve}
      />
    </div>
  )
}
