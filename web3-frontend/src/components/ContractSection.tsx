import InputModal, {InputTypes} from "./InputModal";
import {useState} from "react";
import Avatar from "boring-avatars";

interface ContractSectionProps {
  inputType: InputTypes;
  title: string;
  buttonText: string;
  deleteText: string;
  description: string;
  entries: string[];
  modalTitle: string;
  modalButtonText: string;
  modalExampleInput: string;
  addAction: any;
  removeAction: any;
}

export default function ContractSection(props: ContractSectionProps) {
  const inputType = props.inputType
  const title = props.title
  const buttonText = props.buttonText
  const deleteText = props.deleteText
  const description = props.description
  const entries = props.entries
  const modalTitle = props.modalTitle
  const modalExampleInput = props.modalExampleInput
  const modalButtonText = props.modalButtonText
  const addAction = props.addAction
  const removeAction = props.removeAction

  const [openModal, setOpenModal] = useState(false)

  return (
    <div>
      <InputModal inputType={inputType} open={openModal} setOpen={setOpenModal} inputCallback={addAction}
                  inputExample={modalExampleInput} inputTitle={modalTitle} inputButtonText={modalButtonText}/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-12">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            <p className="mt-2 text-sm text-gray-700">
              {description}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-[#09427d] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#052d57] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              onClick={() => {
                setOpenModal(true)
              }}
            >
              {buttonText}
            </button>
          </div>
        </div>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                  <tr>
                    <th scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Address
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                  </thead>
                  <tbody className="bg-white">
                  {entries.map((entry, entryIdx) => (
                    <tr key={entry} className={entryIdx % 2 === 0 ? undefined : 'bg-gray-50'}
                        hidden={entry.includes("0x000000") || (entry.length > 0 ? false : true)}>
                      <td
                        className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 flex items-center">
                        {!entry.includes("did") &&
                          <span className="mr-3">
                            <Avatar
                              size={40}
                              name={entry}
                              variant="beam"
                              colors={["#8ecae6", "#219ebc", "#023047", "#ffb703", "#fb8500"]}
                            />
                          </span>
                        }
                        {entry.includes("did") ? <a href={"https://dev.uniresolver.io/1.0/identifiers/" + entry}
                                                    target="_blank">{entry}</a> : entry}
                      </td>
                      <td
                        className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button className="text-bg-[#09427d] hover:text-[#052d57]" onClick={() => {
                          removeAction(entry);
                        }}>
                          {deleteText}{/*removing ? "Processing..." : "Delete"*/}<span
                          className="sr-only">, {entry}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}