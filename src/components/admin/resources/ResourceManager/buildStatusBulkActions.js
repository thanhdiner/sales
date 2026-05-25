function buildStatusBulkActions(t, _permissions, config) {
  const {
    canDelete,
    canEdit,
    deleteLabel,
    changePositionLabel,
    changeStatusLabel,
    activeLabel,
    inactiveLabel
  } = config

  return [
    canDelete && { title: deleteLabel || t('bulk.actions.delete'), value: 'delete' },
    canEdit && {
      title: changePositionLabel || t('bulk.actions.changePosition'),
      value: 'change-position'
    },
    canEdit && {
      title: changeStatusLabel || t('bulk.actions.changeStatus'),
      value: 'change-status',
      disabled: true,
      children: [
        { title: activeLabel || t('status.active'), value: 'status-active' },
        { title: inactiveLabel || t('status.inactive'), value: 'status-inactive' }
      ]
    }
  ].filter(Boolean)
}

export default buildStatusBulkActions
