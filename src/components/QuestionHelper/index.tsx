import React from 'react'
import { Placement, useTooltip } from 'hooks/useTooltip'
import { IoHelpCircleOutline } from 'react-icons/io5'

interface Props {
  text: string | React.ReactNode
  placement?: Placement
}

const QuestionHelper: React.FC<Props> = ({ text, placement = 'top', ...props }) => {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(text, { placement, trigger: 'hover' })

  return (
    <div className="inline-flex items-center" {...props}>
      {tooltipVisible && tooltip}
      <div className="inline-flex" ref={targetRef}>
        <IoHelpCircleOutline className="text-black-400" />
      </div>
    </div>
  )
}

export default QuestionHelper
