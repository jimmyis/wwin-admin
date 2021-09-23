import React, { useState } from 'react'
import 'assets/styles/components/_user-wallet.scss'
import { IoCopyOutline } from 'react-icons/io5'

interface CopyAddressProps {
  account: string
}

const CopyAddress: React.FC<CopyAddressProps> = ({ account, ...props }) => {
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false)

  const copyAddress = () => {
    if (navigator.clipboard && navigator.permissions) {
      navigator.clipboard.writeText(account).then(() => displayTooltip())
    } else if (document.queryCommandSupported('copy')) {
      const ele = document.createElement('textarea')
      ele.value = account
      document.body.appendChild(ele)
      ele.select()
      document.execCommand('copy')
      document.body.removeChild(ele)
      displayTooltip()
    }
  }

  function displayTooltip() {
    setIsTooltipDisplayed(true)
    setTimeout(() => {
      setIsTooltipDisplayed(false)
    }, 1000)
  }

  return (
    <div className={`relative`} {...props}>
      <div className="copy-address-container">
        <div title={account} className="flex-1 pl-4">
          <input type="text" readOnly value={account} className="w-full font-bold text-black-600" />
        </div>
        <button className="copy-button" onClick={copyAddress}>
          <IoCopyOutline className="text-xl" />
        </button>
      </div>
      <div
        className="absolute p-2 right-0 text-center bg-black-600 text-white rounded-2xl opacity-70 w-28"
        style={{
          display: isTooltipDisplayed ? 'inline-block' : 'none',
          top: `-30px`,
        }}>
        Copied
      </div>
    </div>
  )
}

export default CopyAddress
