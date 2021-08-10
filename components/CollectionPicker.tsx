import { getData } from '@/utils/api'
import { PAGES } from '@/utils/constant'
import React, { ReactElement, useState } from 'react'
import Button from './base/Button'
import Input from './base/Input'
import Pagination from './base/Pagination'
import CollectionLoader from './base/CollectionLoader'
import GetDataError from './base/GetDataError'
import Link from 'next/link'
import { Modal } from './base/Modal'
import { userContext } from './auth/userProvider'
import { Twemoji } from 'react-emoji-render'
import { CheckCircleIcon } from '@heroicons/react/solid'
interface Props {
  isOpen
  onCloseModal
  onSelected
}

export default function CollectionPicker({
  isOpen,
  onCloseModal,
  onSelected,
}: Props): ReactElement {
  const user = userContext()

  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')

  const [listSelected, setListSelected] = useState<Array<any>>([])

  const paginateQuery = `&$skip=${
    page * limit
  }&$limit=${limit}&title[$search]=${search}`
  const { data: listCollection, error, isLoading } = getData(
    user?.id ? `collection?userId=${user?.id}${paginateQuery}` : ''
  )

  const onSearch = (e) => {
    e.preventDefault()
    e.target.search.blur()
  }

  const toggleSelect = (item: any) => {
    if (listSelected.find((i) => i.id === item.id)) {
      setListSelected(listSelected.filter((i) => i.id !== item.id))
    } else {
      setListSelected((old) => [...old, ...[item]])
    }
  }

  const onApply = () => {
    onSelected(listSelected)
    onCloseModal()
  }

  const onClear = () => {
    setListSelected([])
  }

  return (
    <div>
      <Modal isOpen={isOpen} closeModal={onCloseModal}>
        <div>
          <section
            className={`mb-2 mt-4 container mx-auto flex flex-col sm:flex-row justify-between items-center`}
          >
            <h1 className={`font-semibold text-xl`}>
              {listCollection?.total} collections
            </h1>
            <form onSubmit={onSearch} className={`my-2 w-full sm:w-auto`}>
              <Input
                name="search"
                icon="search-outline"
                type="search"
                placeholder="search title..."
                onChange={(e) => setSearch(e.target.value)}
                defaultValue={search}
                autoFocus={false}
                autoComplete={'off'}
              ></Input>
            </form>
          </section>

          {/* Loading */}
          {isLoading ? (
            <section className={`flex justify-center`}>
              <CollectionLoader uniqueKey={'collection-loader'} />
            </section>
          ) : null}

          {/* List Collection */}
          {!isLoading && !error && listCollection?.data?.length ? (
            <>
              <div
                className={`flex container mx-auto justify-center mb-3 px-4`}
              >
                <Pagination
                  page={page}
                  total={listCollection.total}
                  limit={listCollection.limit}
                  onPageChange={setPage}
                />
              </div>

              <section
                className={`container mx-auto  grid grid-rows-1 grid-cols-1 gap-3`}
              >
                {listCollection.data.map((i, index) => (
                  <div key={index}>
                    <button
                      onClick={() => toggleSelect(i)}
                      className={`border-2 ${
                        listSelected.find((f) => f.id === i.id) ? ' ' : ''
                      } border-solid w-full block relative text-center p-1 rounded-md shadow-md hover:shadow-lg `}
                    >
                      <span
                        title={i.title}
                        className={`flex w-full h-full space-x-2 px-2 py-1 items-center font-semibold`}
                      >
                        <div className={`flex-none text-lg`}>
                          <Twemoji text={i.icon} />
                        </div>
                        <div className={`truncate`}>{i.title}</div>

                        <div
                          className={`${
                            listSelected.find((f) => f.id === i.id)
                              ? ''
                              : 'hidden'
                          } absolute top-0 right-1 bg-white p-1`}
                        >
                          <CheckCircleIcon
                            width="30"
                            className={`text-green-600`}
                          ></CheckCircleIcon>
                        </div>
                      </span>
                    </button>
                  </div>
                ))}
              </section>

              <div className={`mt-6 mb-2 flex justify-center`}>
                <Button
                  disabled={!listSelected.length}
                  onClick={onApply}
                  icon="arrow-circle-right-outline"
                  color="info"
                >
                  Apply
                </Button>
              </div>
              <div className={`flex mb-2 justify-center text-sm font-semibold`}>
                {listSelected.length
                  ? `( ${listSelected.length} collections )`
                  : ''}
              </div>
              {listSelected.length ? (
                <div>
                  <div>
                    <hr />
                  </div>
                  <div className={`mt-4 mb-0 flex justify-center`}>
                    <Button
                      color="info-outline"
                      onClick={onClear}
                      icon="trash-outline"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              ) : null}
            </>
          ) : null}

          {/* Not found */}
          {!isLoading && !error && !listCollection?.data?.length ? (
            <section className={`flex justify-center items-center `}>
              <div>
                <figure>
                  <img
                    width="175"
                    className={`mx-auto`}
                    src="/nodata_flower.png"
                    alt="no data"
                  />
                </figure>
                <div className={`mt-4 text-center font-semibold`}>
                  No collection found.
                </div>
                <div className={`mt-4 flex justify-center`}>
                  <Link href={PAGES.NEW_COLLECION}>
                    <Button color="info-outline" icon="plus-outline">
                      Create new collection
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
          ) : null}

          {!isLoading && error ? <GetDataError /> : null}
        </div>
      </Modal>
    </div>
  )
}