import {
  Cookie,
  Database,
  FileText,
  Globe2,
  LockKeyhole,
  Mail,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Users,
} from "lucide-react";

const sections = [
  {
    number: "01",
    title: "Pendahuluan",
    icon: FileText,
    content: (
      <>
        <p>
          Kebijakan Privasi ini menjelaskan bagaimana PT Eco Karya Teknologi
          (&quot;Crustea&quot;, &quot;kami&quot;, atau &quot;perusahaan&quot;)
          mengumpulkan, menggunakan, menyimpan, dan melindungi informasi ketika
          Anda mengakses atau menggunakan situs web dan layanan Crustea.
        </p>

        <p>
          Kami menghargai privasi setiap pengguna dan berkomitmen untuk
          mengelola informasi pribadi secara bertanggung jawab sesuai dengan
          ketentuan hukum dan peraturan yang berlaku.
        </p>
      </>
    ),
  },

  {
    number: "02",
    title: "Informasi yang Kami Kumpulkan",
    icon: Database,
    content: (
      <>
        <p>
          Informasi yang dapat kami kumpulkan bergantung pada bagaimana Anda
          berinteraksi dengan situs dan layanan kami.
        </p>

        <h4>Informasi yang Anda berikan secara langsung</h4>

        <ul className="list-disc space-y-2 pl-5 marker:text-brand-secondary">
          <li>Nama lengkap</li>
          <li>Alamat email</li>
          <li>Nomor telepon atau WhatsApp</li>
          <li>Nama perusahaan atau organisasi</li>
          <li>Informasi kebutuhan produk atau layanan</li>
          <li>Informasi lain yang Anda sampaikan melalui formulir kontak</li>
        </ul>

        <h4>Informasi yang dikumpulkan secara otomatis</h4>

        <ul className="list-disc space-y-2 pl-5 marker:text-brand-secondary">
          <li>Alamat IP</li>
          <li>Jenis perangkat</li>
          <li>Sistem operasi dan browser</li>
          <li>Halaman yang dikunjungi</li>
          <li>Waktu dan durasi kunjungan</li>
          <li>Informasi penggunaan situs lainnya</li>
        </ul>
      </>
    ),
  },

  {
    number: "03",
    title: "Tujuan Penggunaan Data",
    icon: Settings2,
    content: (
      <>
        <p>
          Informasi yang kami kumpulkan dapat digunakan untuk berbagai tujuan
          yang berkaitan dengan penyediaan dan pengembangan layanan Crustea.
        </p>

        <ul className="list-disc space-y-2 pl-5 marker:text-brand-secondary">
          <li>Merespons pertanyaan dan permintaan Anda.</li>
          <li>Memberikan informasi mengenai produk dan layanan.</li>
          <li>Memproses permintaan konsultasi atau kemitraan.</li>
          <li>
            Meningkatkan kualitas produk, layanan, dan pengalaman pengguna.
          </li>
          <li>
            Menganalisis penggunaan situs untuk pengembangan lebih lanjut.
          </li>
          <li>Menjaga keamanan dan mencegah penyalahgunaan situs.</li>
          <li>Memenuhi kewajiban hukum dan peraturan yang berlaku.</li>
        </ul>
      </>
    ),
  },

  {
    number: "04",
    title: "Cookies dan Analytics",
    icon: Cookie,
    content: (
      <>
        <p>
          Situs Crustea dapat menggunakan cookies dan teknologi serupa untuk
          membantu meningkatkan pengalaman pengguna, memahami bagaimana situs
          digunakan, serta mengoptimalkan performa situs.
        </p>

        <p>
          Cookies dapat digunakan untuk menyimpan preferensi tertentu, memahami
          pola penggunaan, dan membantu kami melakukan analisis terhadap
          performa situs.
        </p>

        <p>
          Anda dapat mengatur atau menonaktifkan cookies melalui pengaturan
          browser yang digunakan. Namun, beberapa bagian situs mungkin tidak
          berfungsi secara optimal apabila cookies dinonaktifkan.
        </p>
      </>
    ),
  },

  {
    number: "05",
    title: "Pihak Ketiga",
    icon: Users,
    content: (
      <>
        <p>
          Dalam menjalankan operasional situs dan layanan, kami dapat
          menggunakan layanan dari pihak ketiga yang membantu menyediakan fungsi
          tertentu, seperti analitik, hosting, komunikasi, keamanan, atau
          layanan teknologi lainnya.
        </p>

        <p>
          Pihak ketiga tersebut hanya dapat mengakses informasi sejauh yang
          diperlukan untuk menjalankan layanan yang diberikan kepada kami dan
          diharapkan menangani informasi sesuai dengan ketentuan yang berlaku.
        </p>

        <p>
          Kami tidak menjual informasi pribadi pengguna kepada pihak ketiga
          untuk tujuan pemasaran.
        </p>
      </>
    ),
  },

  {
    number: "06",
    title: "Penyimpanan dan Keamanan",
    icon: LockKeyhole,
    content: (
      <>
        <p>
          Kami menerapkan langkah-langkah teknis dan organisasi yang wajar untuk
          membantu melindungi informasi yang kami kelola dari akses, penggunaan,
          perubahan, pengungkapan, atau penghancuran yang tidak sah.
        </p>

        <p>
          Informasi hanya disimpan selama diperlukan untuk memenuhi tujuan
          pengumpulannya, menyediakan layanan, memenuhi kewajiban hukum, atau
          menyelesaikan perselisihan.
        </p>

        <p>
          Meskipun kami berupaya menjaga keamanan informasi, tidak ada metode
          transmisi atau penyimpanan data elektronik yang dapat dijamin
          sepenuhnya aman.
        </p>
      </>
    ),
  },

  {
    number: "07",
    title: "Hak Pengguna",
    icon: ShieldCheck,
    content: (
      <>
        <p>
          Tergantung pada ketentuan hukum yang berlaku, pengguna dapat memiliki
          hak tertentu terkait informasi pribadinya.
        </p>

        <ul className="list-disc space-y-2 pl-5 marker:text-brand-secondary">
          <li>
            Meminta informasi mengenai data pribadi yang kami miliki tentang
            Anda.
          </li>

          <li>Meminta koreksi terhadap informasi yang tidak akurat.</li>

          <li>
            Meminta penghapusan informasi dalam kondisi yang diperbolehkan oleh
            hukum.
          </li>

          <li>
            Menarik persetujuan terhadap penggunaan data tertentu apabila
            pemrosesan didasarkan pada persetujuan.
          </li>

          <li>
            Mengajukan pertanyaan atau keberatan mengenai penggunaan informasi
            pribadi.
          </li>
        </ul>

        <p>
          Untuk menggunakan hak tersebut, Anda dapat menghubungi kami melalui
          informasi kontak yang tersedia pada bagian akhir kebijakan ini.
        </p>
      </>
    ),
  },

  {
    number: "08",
    title: "Tautan Pihak Ketiga",
    icon: Globe2,
    content: (
      <>
        <p>
          Situs Crustea dapat menyediakan tautan menuju situs, platform, atau
          layanan pihak ketiga.
        </p>

        <p>
          Kebijakan Privasi ini hanya berlaku untuk situs dan layanan yang
          dikelola oleh Crustea. Kami tidak bertanggung jawab atas praktik
          privasi, keamanan, maupun konten yang terdapat pada situs pihak
          ketiga.
        </p>

        <p>
          Kami menyarankan Anda membaca kebijakan privasi dari setiap situs
          pihak ketiga yang Anda kunjungi.
        </p>
      </>
    ),
  },

  {
    number: "09",
    title: "Perubahan Kebijakan Privasi",
    icon: RefreshCw,
    content: (
      <>
        <p>
          Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu untuk
          menyesuaikan dengan perubahan layanan, teknologi, kebutuhan
          operasional, maupun ketentuan hukum yang berlaku.
        </p>

        <p>
          Setiap perubahan akan dipublikasikan pada halaman ini dengan tanggal
          pembaruan yang sesuai. Kami menyarankan pengguna untuk meninjau
          halaman ini secara berkala.
        </p>
      </>
    ),
  },

  {
    number: "10",
    title: "Hubungi Kami",
    icon: Mail,
    content: (
      <>
        <p>
          Jika Anda memiliki pertanyaan, permintaan, atau keluhan mengenai
          Kebijakan Privasi ini maupun bagaimana kami menangani informasi
          pribadi, silakan hubungi kami melalui:
        </p>

        <div className="mt-5 rounded-2xl border border-border bg-secondary/50 p-5">
          <p className="font-semibold text-foreground">
            PT Eco Karya Teknologi
          </p>

          <div className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
            <p>
              Ground Floor Crustea Labs
              <br />
              Jl. Sanggung Timur No. 1
              <br />
              Jatingaleh, Semarang
              <br />
              Jawa Tengah 50254
            </p>

            <p>
              Email:{" "}
              <a
                href="mailto:info@crustea.id"
                className="font-medium text-brand-dark transition-colors hover:text-brand-secondary"
              >
                info@crustea.id
              </a>
            </p>

            <p>
              WhatsApp:{" "}
              <a
                href="https://wa.me/6282140773592"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-dark transition-colors hover:text-brand-secondary"
              >
                +62 821-4077-3592
              </a>
            </p>
          </div>
        </div>
      </>
    ),
  },
];

export default function KebijakanPrivasiPage() {
  return (
    <>
      {/* =====================================================
            INTRO
        ===================================================== */}
      <section className="relative overflow-hidden bg-background">
        <div
          className="pointer-events-none absolute -left-40 top-20 size-[360px] rounded-full bg-secondary/50 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -right-40 bottom-0 size-[360px] rounded-full bg-accent/40 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:py-16 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
              Privasi & Keamanan
            </p>

            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
              Kami menghargai privasi Anda.
            </h1>

            <p className="mt-5 text-[15px] leading-7 text-muted-foreground">
              Kebijakan Privasi ini menjelaskan bagaimana Crustea mengelola
              informasi yang dikumpulkan melalui situs dan layanan kami. Kami
              berkomitmen untuk menggunakan informasi secara bertanggung jawab
              dan menjaga keamanan data pengguna.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm">
              <ShieldCheck
                className="size-4 text-brand-secondary"
                aria-hidden="true"
              />
              Terakhir diperbarui: September 2026
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
            PRIVACY CONTENT
        ===================================================== */}
      <section className="relative border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
            {/* =================================================
                    SIDEBAR
                ================================================= */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 h-fit">
                <div className="rounded-[24px] border border-border bg-background p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-secondary">
                    Daftar Isi
                  </p>

                  <nav className="mt-4 space-y-1" aria-label="Daftar Isi">
                    {sections.map((section) => (
                      <a
                        key={section.number}
                        href={`#privacy-${section.number}`}
                        className="flex items-start gap-3 rounded-lg px-3 py-2 text-sm leading-5 text-muted-foreground transition-colors hover:bg-secondary hover:text-brand-dark"
                      >
                        <span className="shrink-0 font-semibold text-brand-secondary">
                          {section.number}
                        </span>

                        <span>{section.title}</span>
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </aside>

            {/* =================================================
                CONTENT
            ================================================= */}
            <div className="min-w-0 space-y-5">
              {sections.map((section) => {
                const Icon = section.icon;

                return (
                  <article
                    key={section.number}
                    id={`privacy-${section.number}`}
                    className="scroll-mt-28 rounded-[24px] border border-border bg-background p-6 shadow-sm sm:p-8"
                  >
                    {/* Header */}
                    <div className="flex items-start gap-4">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-brand-secondary">
                        <Icon
                          className="size-5"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold tracking-[0.14em] text-brand-secondary">
                            {section.number}
                          </span>

                          <span
                            className="h-px w-6 bg-border"
                            aria-hidden="true"
                          />
                        </div>

                        <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                          {section.title}
                        </h2>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="privacy-content mt-6 pl-0 text-[14px] leading-7 text-muted-foreground sm:pl-[60px]">
                      {section.content}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
