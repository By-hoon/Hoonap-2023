import { useRouter } from "next/router";

const StoryEdit = () => {
  const router = useRouter();

  const { title, story, images, paths, userId, storyId } = router.query;

  return <div>edit story</div>;
};

export default StoryEdit;
