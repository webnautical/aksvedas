import { LoadingBTN } from "./LoadingBTN";

const DeleteModal = (props) => {
    const { id, handleFunc, loading } = props;
    return (
        <div className="modal fade" id={id} tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-lg modal-simple">
                <div className="modal-content p-md-5">
                    <div className="modal-body">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        <div className="text-center mb-4">
                            <h3 className="mb-2">Alert</h3>
                            <p className="text-muted">Are you sure? you want to delete it.</p>
                        </div>

                        <div className="col-12 text-center">
                            {
                                loading ? <LoadingBTN />:
                                    <button type="button" className="btn btn-primary me-sm-3 me-1" onClick={() => handleFunc()}>YES</button>
                            }
                            <button type="reset" className="btn btn-label-secondary" data-bs-dismiss="modal" aria-label="Close">NO</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteModal

export function closeModal(id) {
    let modal = document.getElementById(id);
    // modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
}
