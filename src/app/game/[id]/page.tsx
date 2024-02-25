import { GameProps } from "@/utils/types/game";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/container";
import { Label } from "./components/label";
import { GameCard } from "@/components/GameCard";
import { Metadata } from "next";

interface PropsParams {
  params: {
    id: string;
  };
}

//RETORNAMOS UMA PROMISE COM O METADATA
export async function generateMetadata({
  params,
}: PropsParams): Promise<Metadata> {
  try {
    const response: GameProps = await fetch(
      `${process.env.NEXT_API_URL}/next-api/?api=game&id=${params.id}`,
      { next: { revalidate: 60 } } //evita o revalidate
    )
      .then((res) => res.json())
      .catch(() => {
        return {
          title: "DalyGames - Descubra jogos incríveis para se divertir.",
          description: `${response.description.slice(0, 100)}...`,
          openGraph: {
            title: response.title,
            images: response.image_url,
          },
          robots: {
            index: true,
            follow: true,
            nocache: true,
            googleBot: {
              index: true,
              follow: true,
              noimageindex: true,
            },
          },
        };
      });

    return {
      title: response.title,
    };
  } catch (err) {
    return {
      title: "DalyGames - Descubra jogos incríveis para se divertir.",
    };
  }
}

//pegando o id pelo parametro
async function getData(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_API_URL}/next-api/?api=game&id=${id}`,
      { next: { revalidate: 60 } } //evita o revalidate
    );
    return res.json();
  } catch (err) {
    throw new Error("DEU RUIM");
  }
}

async function getGameSorted() {
  try {
    const res = await fetch(
      `${process.env.NEXT_API_URL}/next-api/?api=game_day`,
      { cache: "no-store" } //valida a cada req (atualizadao de pagina)
    );
    return res.json();
  } catch (err) {
    throw new Error("DEU RUIM");
  }
}

export default async function Game({
  params: { id },
}: {
  params: { id: string };
}) {
  const data: GameProps = await getData(id);
  const sortedGame: GameProps = await getGameSorted();

  console.log(sortedGame);

  //se nao tiver data vamos para o home
  if (!data) {
    redirect("/");
  }

  console.log(data);

  //tipando o parametro
  return (
    <main className="w-full text-black">
      <div className="bg-black h-80 sm:h-96 w-full relative">
        <Image
          className="object-cover w-full h-80 sm:h-96 opacity-80"
          src={data.image_url}
          alt={data.title}
          priority={true}
          fill={true}
          sizes="(max-width: 768px) 100vw, (max-width:1200px) 33vw"
        />
      </div>
      <Container>
        <h1 className="font-bold text-xl my-4">{data.title}</h1>
        <p>{data.description}</p>

        <h2 className="font-bold text-lg mt-7 mb-2">Plataformas</h2>
        <div className="flex gap-2 flex-wrap">
          {data.platforms.map((item) => (
            <Label name={item} key={item} />
          ))}
        </div>

        <h2 className="font-bold text-lg mt-7 mb-2">Categorias</h2>
        <div className="flex gap-2 flex-wrap">
          {data.categories.map((item) => (
            <Label name={item} key={item} />
          ))}
        </div>

        <p className="mt-7 mb-2">
          <strong>Data de lançamento:</strong> {data.release}
        </p>

        <h2 className="font-bold text-lg mt-7 mb-2">Jogo recomendado:</h2>
        <div className="flex">
          {/* flex-grow cresce ate o tamanho maximo da div */}
          <div className="flex-grow">
            <GameCard data={sortedGame} />
          </div>
        </div>
      </Container>
    </main>
  );
}
