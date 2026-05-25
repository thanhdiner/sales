import { Button } from 'antd'

function ResourceUtility({ buttons, className, itemClassPrefix }) {
  return (
    <div className={className}>
      {buttons.map(button =>
        button.dropdown ? (
          <div key={button.key} className={`${itemClassPrefix} ${itemClassPrefix}--${button.key}`}>
            {button.dropdown}
          </div>
        ) : (
          <Button
            key={button.key}
            onClick={button.onClick}
            className={`${button.className} ${itemClassPrefix} ${itemClassPrefix}--${button.key}`.trim()}
          >
            {button.icon}
            <span className={button.labelClassName}>{button.label}</span>
            {button.mobileLabel && button.mobileLabel !== button.label ? (
              <span className={button.mobileLabelClassName}>{button.mobileLabel}</span>
            ) : null}
          </Button>
        )
      )}
    </div>
  )
}

export default ResourceUtility
