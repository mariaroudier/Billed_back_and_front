/**
 * @jest-environment jsdom
 */

import {fireEvent, getByTestId, screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import userEvent  from "@testing-library/user-event"
import DashboardFormUI from "../views/DashboardFormUI.js"
import DashboardUI from "../views/DashboardUI.js"
import Dashboard, { filteredBills, cards } from "../containers/Dashboard.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store"
import { bills } from "../fixtures/bills"
import router from "../app/Router"
 
// the begining of my test
describe("Given I am connected as an employee", () => {
  
  jest.mock("../app/store", () => mockStore)
  
  describe("When I am on NewBill Page", () => {
    test("Then I upload file the function handleChangeFile was called", async() => {
    //to-do write assertion
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)

      const newBill = new NewBill({document, onNavigate, store: mockStore, localStorage: null})
      const html = NewBillUI()
      document.body.innerHTML = html
      await waitFor(() => screen.getByTestId('file'))
      const handleChangeFile1 = jest.fn((e) => newBill.handleChangeFile(e))
      const file = screen.getByTestId('file')
      const fake = new File(['bonjour'], 'fakeFile.jpg')
  
      file.addEventListener('change', handleChangeFile1)
      userEvent.upload(file, fake)
      expect(handleChangeFile1).toHaveBeenCalled()
      //expect(store.then).toBeDefined()
    })

    test("Then I upload file with an extension of file not jpeg,jpg or png", async() => { // a propos de donnees ? 
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)

      await waitFor(() => document.querySelector("#btn-send-bill"))
      const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage });
      let fileInput = screen.queryAllByTestId('file')[0]
      const fakeFile = new File(['fake'], 'fake.zip');
      userEvent.upload(fileInput, fakeFile)
      const fnhandleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
      fireEvent.click(fileInput, fnhandleChangeFile)
      expect(jest.spyOn(mockStore, "bills")).not.toHaveBeenCalled()
      })

    test("Then I upload file with a wright extension of file like jpeg,jpg or png", async() => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)

      await waitFor(() => document.querySelector("#btn-send-bill"))
      const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage });
      let fileInput = screen.queryAllByTestId('file')[0]
      const fakeFile = new File(['fake'], 'fake.jpeg');
      userEvent.upload(fileInput, fakeFile)
      const fnhandleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
      fireEvent.click(fileInput, fnhandleChangeFile)
      expect(jest.spyOn(mockStore, "bills")).toHaveBeenCalled()
    })

    test("blabla", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)


      await waitFor(() => screen.getAllByTestId("form-new-bill"))
      const form = screen.getAllByTestId("form-new-bill")[0]
      const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage });
      let fileInput = screen.queryAllByTestId('file')[0]
      const fakeFile = new File(['fake'], 'fake.jpeg');
      userEvent.upload(fileInput, fakeFile)
      const fnhandleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
      const handleSubmit1 = jest.fn((e) => newBill.handleSubmit(e))
      fireEvent.click(fileInput, fnhandleChangeFile)
      form.addEventListener('submit', handleSubmit1)
      fireEvent.submit(form)
      expect(handleSubmit1).toBeCalled()
      expect(jest.spyOn(mockStore, "bills")).toHaveBeenCalled()
    })
  })
})