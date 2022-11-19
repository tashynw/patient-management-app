import { unstable_getServerSession } from 'next-auth';
import React from 'react'
import NavBar from '../../components/navbar';
import { UserType } from '../../types';
import { authOptions } from '../api/auth/[...nextauth]';

interface DoctorPageProps{
    pageSession: UserType;
}

const DoctorPage = (props: DoctorPageProps) => {
    return (
        <>
            <NavBar pageSession={props?.pageSession}/>
            <div className="container">
                <div className="h-100 d-flex justify-content-between align-items-center mt-5">
                    <h2>Doctor Management</h2>
                </div>
                <br />
                <br />
                <form>
                    <div className="form-group w-25">
                        <div
                        className="input-group d-flex align-items-center"
                        style={{ gap: "10px" }}
                        >
                        <label>Enter Patient's Full Name</label>
                        <input
                            type="search"
                            className="form-control"
                            required
                        />
                        </div>
                    </div>
                </form>
                <br />
                <br />
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                            <th scope="col">FirstName</th>
                            <th scope="col">LastName</th>
                            <th scope="col">Age</th>
                            <th scope="col">Number</th>
                            <th scope="col">Address</th>
                            <th scope="col">Appointments</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                                <td>@mdo</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                                <td>@fat</td>
                                <td>@fat</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Larry</td>
                                <td>the Bird</td>
                                <td>@twitter</td>
                                <td>@twitter</td>
                                <td>@twitter</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>     
    )
}

export default DoctorPage

export async function getServerSideProps(context: any) {
    const session:any = await unstable_getServerSession(
      context.req,
      context.res,
      authOptions
    );
  
    if (!session || session?.role != "Doctor") {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  
    return {
      props: {
        pageSession: JSON.parse(JSON.stringify(session)),
      },
    };
  }