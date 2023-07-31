import "./loading.scss";
type PropsType = {
  isLoading?: boolean;
};

export default function Loading({ isLoading }: PropsType) {
  return (
    <div
      className={`${isLoading ? "loading_page activeLoading" : "loading_page"}`}
    >
      <img className="logoIcon" alt="" src="assets/logo.png" />
    </div>
  );
}
