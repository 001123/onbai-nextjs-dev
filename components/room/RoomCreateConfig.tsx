import React, { ReactElement, useState } from 'react'
import toast from 'react-hot-toast'
import { userContext } from '../auth/userProvider'
import Button from '../base/Button'
import Input from '../base/Input'
import CollectionPicker from '../CollectionPicker'
import { roomContext } from './roomProvider'
import { toArray } from 'lodash'

interface Props {}

export default function RoomCreateConfig({}: Props): ReactElement {
  const user = userContext()
  const room = roomContext()
  const listRoomUser = toArray(room.users)

  // Configs
  const [collection, setCollection] = useState<any>([])
  const [mode, setMode] = useState<any>(0)
  const [rule, setRule] = useState<any>()
  const [time, setTime] = useState<any>(1)
  const [score, setScore] = useState<any>(10)

  // Modal
  const [isOpen, setIsOpen] = useState<any>(false)

  const onSubmit = (e) => {
    e.preventDefault()
    console.log('Submit', e)
    toast.success('Submit')
    document.getElementById('timer')?.blur()
    document.getElementById('score_goal')?.blur()
    window.scrollTo(0, 0)
  }

  return (
    <>
      <form
        onSubmit={onSubmit}
        className={`w-full sm:w-96 mx-auto px-4 sm:px-0 font-semibold mb-12 `}
      >
        <div className={`border shadow rounded-md p-2 my-2`}>
          <div className={`text-center mb-2 underline`}>1. Data</div>

          <div className={`flex justify-center`}>
            <Button
              onClick={() => setIsOpen(true)}
              icon="external-link-outline"
              color="primary"
              type="button"
            >
              Select collections
            </Button>
          </div>
          <div className="mt-3 mb-1 flex justify-center">
            <div className={`whitespace-nowrap overflow-auto`}>
              {collection.map((i) => (
                <div
                  key={i.id}
                  className={`shadow-md inline-block mx-1 bg-green-500 text-white px-2 rounded-md`}
                >
                  {i.title}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`border shadow rounded-md p-2 my-2`}>
          <div className={`text-center mb-1 underline`}>2. Mode</div>
          <div className={`flex justify-center space-x-2`}>
            <label htmlFor="score">
              <input
                type="radio"
                name="mode"
                id="score"
                value={0}
                onChange={(e) => setMode(+e.target.value)}
                checked={mode == 0}
              />{' '}
              Score
            </label>
            <label htmlFor="time">
              <input
                type="radio"
                name="mode"
                id="time"
                value={1}
                onChange={(e) => setMode(+e.target.value)}
                checked={mode == 1}
              />{' '}
              Time
            </label>
            <label htmlFor="all">
              <input
                type="radio"
                name="mode"
                id="all"
                value={2}
                onChange={(e) => setMode(+e.target.value)}
                checked={mode == 2}
              />{' '}
              All
            </label>
          </div>
          <div className={`p-2 grid grid-cols-1 grid-rows-1 gap-2 mt-1`}>
            {[0, 2].includes(mode) ? (
              <div className={``}>
                <label className={``} htmlFor="score_goal">
                  <div className={`mb-1`}>Score goal</div>
                  <Input
                    defaultValue="10"
                    min="1"
                    type="number"
                    id="score_goal"
                    name="score_goal"
                  />
                </label>
              </div>
            ) : null}
            {mode === 2 ? <div>or</div> : null}
            {[1, 2].includes(mode) ? (
              <div className={``}>
                <label htmlFor="timer">
                  <div className={`mb-1`}>Timer (minute)</div>
                  <Input
                    defaultValue="5"
                    min="1"
                    type="number"
                    id="timer"
                    name="timer"
                  />
                </label>
              </div>
            ) : null}
          </div>
        </div>

        <div className={`flex justify-center mt-4 `}>
          <Button
            disabled={!collection.length || listRoomUser.length < 2}
            icon="arrow-circle-right-outline"
            color="info"
            type="submit"
          >
            Start practice
          </Button>
        </div>
        {!collection.length ? (
          <div className={`text-center my-2 text-sm`}>
            <span className={`text-red-500`}>*</span> Please select at least one
            collection.
          </div>
        ) : null}
        {listRoomUser.length < 2 ? (
          <div className={`text-center my-2 text-sm`}>
            <span className={`text-red-500`}>*</span> Please wait at least one
            member join room.
          </div>
        ) : null}
      </form>

      <CollectionPicker
        isOpen={isOpen}
        onCloseModal={() => setIsOpen(false)}
        onSelected={(list) => setCollection(list)}
      />
    </>
  )
}
