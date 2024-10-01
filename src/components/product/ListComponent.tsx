import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getProductList} from "../../api/productAPI.ts";

import {IProduct, IPageResponse} from "../../types/product.ts";
import LoadingComponent from "../LoadingComponent.tsx";
import PageComponent from "../PageComponent.tsx";

const initialState: IPageResponse = {
    dtoList: [],
    pageNumList: [],
    pageRequestDTO: {
        page: 1,
        size: 10
    },
    prev: false,
    next: false,
    totalCount: 0,
    prevPage: 0,
    nextPage: 0,
    totalPage: 0,
    current: 1
};

function ListComponent() {

    const [query, setQuery] = useSearchParams()
    const page: number = Number(query.get("page")) || 1
    const size: number = Number(query.get("size")) || 10
    const [loading, setLoading] = useState<boolean>(false)
    const [pageResponse, setPageResponse] = useState<IPageResponse>(initialState)
    const location = useLocation()
    const navigate = useNavigate();

    const [searchType, setSearchType] = useState(query.get("type") || "");
    const [keyword, setKeyword] = useState(query.get("keyword") || "");

    useEffect(() => {
        setLoading(true)
        getProductList(page, size).then(data => {
            setPageResponse(data)
            setLoading(false)
        })
    }, [query, location.key])

    // 검색 화면 추가
    const handleSearch = () => {
        query.set("type", searchType);
        query.set("keyword", keyword);
        setQuery(query);
    };

    // 조회 페이지 이동
    const moveToRead = (pno: number) => {
        navigate(`/product/detail/${pno}`);
    };

    const listLI = pageResponse.dtoList.map((product: IProduct) => {

        const {pno, pname, pdesc, price, uploadFileNames} = product

        // 이미지 경로 생성
        const thumbnailUrl = uploadFileNames.length > 0
            ? `http://localhost:8089/api/products/view/s_${uploadFileNames[0]}`
            : null;

        return (
            <li key={pno}
                className="flex items-center space-x-4 p-4 border-b border-gray-200"
                onClick={() => moveToRead(pno)}
            >
                {thumbnailUrl && (
                    <img src={thumbnailUrl} alt={pname} className="w-24 h-24 object-cover rounded-md" />
                )}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {pno}. {pname}
                    </h3>
                    <p className="text-sm text-gray-600">{pdesc}</p>
                    <p className="text-md font-medium text-gray-900">{price}원</p>
                </div>
            </li>
        )
    });

    return (
        <div className="container mx-auto py-6">

            {loading && <LoadingComponent/>}
            <div className="flex justify-end mb-6">
                <div className="flex space-x-4">
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-md"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <option value="">---</option>
                        <option value="T">제목</option>
                        <option value="C">내용</option>
                        <option value="W">작성자</option>
                        <option value="TC">제목혹은내용</option>
                        <option value="TW">제목혹은작성자</option>
                        <option value="TCW">제목혹은내용혹은작성자</option>
                    </select>

                    <input
                        type="text"
                        className="px-4 py-2 border border-gray-300 rounded-md"
                        placeholder="검색어 입력"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />

                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={handleSearch}
                    >
                        검색
                    </button>
                </div>
            </div>

            <div className="text-xl font-bold mb-4">Product List</div>

            <ul className="divide-y divide-gray-200">
                {listLI}
            </ul>

            <div className="mt-6">
                <PageComponent pageResponse={pageResponse}/>
            </div>
        </div>
)
    ;
}

export default ListComponent;