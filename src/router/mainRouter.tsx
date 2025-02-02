import {createBrowserRouter} from "react-router-dom";
import {lazy, Suspense} from "react";
import LoadingPage from "../pages/LoadingPage.tsx";
import productRouter from "./productRouter.tsx";

const MainPage = lazy(() => import("../pages/MainPage"))

const Loading = <LoadingPage></LoadingPage>

const mainRouter = createBrowserRouter([
    {
        path: "/",
        element: <Suspense fallback={Loading}><MainPage/></Suspense>
    },
    productRouter

])

export default mainRouter