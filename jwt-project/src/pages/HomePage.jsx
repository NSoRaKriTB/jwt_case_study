import React from 'react'

const HomePage = () => {

    React.useEffect(() => {
        if (!sessionStorage.getItem("token")) {
            window.location.href = "/";
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        window.location.href = "/";
    };

    const handleDataAdmin = () => {
        fetch("http://localhost:3000/api/data/admin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: JSON.stringify({ role: sessionStorage.getItem("role") }),
        },)
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
                alert("ดูข้อมูลสำหรับ Admin");
                alert(`Id: ${data.id} || Username: ${data.username} || Role: ${data.role}`);
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("ดูข้อมูลสำหรับ Admin ไม่สำเร็จ");
            }
            );
    }

    const handleDataMember1 = () => {
        fetch("http://localhost:3000/api/data/memberOne", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: JSON.stringify({ role: sessionStorage.getItem("role") }),
        },)
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
                alert("ดูข้อมูลสำหรับ Member1");
                alert(`Id: ${data.id} || Username: ${data.username} || Role: ${data.role}`);
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("ดูข้อมูลสำหรับ Member1 ไม่สำเร็จ");
            }
            );
    }

    const handleDataMember2 = () => {
        fetch("http://localhost:3000/api/data/memberTwo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: JSON.stringify({ role: sessionStorage.getItem("role") }),
        },)
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
                alert("ดูข้อมูลสำหรับ Member2");
                alert(`Id: ${data.id} || Username: ${data.username} || Role: ${data.role}`);
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("ดูข้อมูลสำหรับ Member2 ไม่สำเร็จ");
            }
            );
    }

    return (
        <>
            <h1 className='text-center'>สถานะ: {sessionStorage.getItem("role")}</h1>
            <div className='d-flex flex-column'>
                <button className='btn btn-md btn-outline-success m-3'
                    onClick={handleDataAdmin}
                >
                    ดูข้อมูลสำหรับ Admin
                </button>
                <button className='btn btn-md btn-outline-success m-3'
                    onClick={handleDataMember1}
                >
                    ดูข้อมูลสำหรับ Member 1
                </button>
                <button className='btn btn-md btn-outline-success m-3'
                    onClick={handleDataMember2}
                >
                    ดูข้อมูลสำหรับ Member 2
                </button>

                <button className='btn btn-sm btn-outline-danger m-3'
                    onClick={handleLogout}
                >
                    ออกจากระบบ
                </button>
            </div>
        </>
    )
}

export default HomePage