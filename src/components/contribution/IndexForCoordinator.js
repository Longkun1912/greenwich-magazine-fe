import {
    MaterialReactTable,
    useMaterialReactTable,
  } from "material-react-table";

  import React, { useMemo, useState } from "react";

const IndexForCoordinator = () => {

    const [contributions, setContributions] = useState([]);
    

    //test
    const handleStatusChange = (id, newStatus) => {
        // Tìm bài viết có id tương ứng trong contributions
        const updatedContributions = contributions.map(contribution => {
            if (contribution.id === id) {
                return { ...contribution, status: newStatus };
            }
            return contribution;
        });
        // Cập nhật state với trạng thái mới của bài viết
        setContributions(updatedContributions);
    };
    
    
    let columns = useMemo (
        () => [
            {
                accessorKey: "id",
                header: "ID",
                size: 100,
            },
            {
                accessorKey: "image",
                header: "Image",
                size: 200,
                Cell: ({ cell }) => (
                  <img
                    src={cell.row.original.image}
                    alt="Contribution"
                    style={{ width: "15vh", height: "15vh" }}
                  />
                ),
            },
            {
                accessorKey: "title",
                header: "Title",
                size: 100,
            },
            {
                accessorKey: "content",
                header: "Content",
                size: 100,
            },
            {
                accessorKey: "document",
                header: "Document",
                size: 100,
                Cell: ({ cell }) =>
                  cell.row.original.document && (
                    <a href={cell.row.original.document} download>
                      <button>Download</button>
                    </a>
                  ),
            },
            
            {
                accessorKey: "submitter",
                header: "submitter",
                size: 100,
            },
            {
                accessorKey: "event",
                header: "Event",
                size: 100,
            },
            {
                accessorKey: "status",
                header: "Status",
                size: 100,
            },
            {
                accessorKey: "Actions",
                header: "Actions",
                size: 100,
                Cell: ({ cell }) => (
                    <div>
                        <button onClick={() => handleStatusChange(cell.row.original.id, 'public')}>
                            Public
                        </button>
                        <button onClick={() => handleStatusChange(cell.row.original.id, 'private')}>
                            Private
                        </button>
                    </div>
                ),
            }
            
        ]
    )

    const table = useMaterialReactTable({
        columns,
        data: contributions,
    });
    
    return (
        <div className="content-container">
        <h1>Contribution Management 2</h1>
            <div className="contribution-index">
                <div style={{ width: "140vh" }}>
                <MaterialReactTable table={table} />
                </div>
            </div>
        </div>
    );

}



export default IndexForCoordinator