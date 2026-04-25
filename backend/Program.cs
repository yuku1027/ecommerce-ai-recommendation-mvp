using System.Reflection;
using EcommerceAiRecommendation.Api.Repositories;
using EcommerceAiRecommendation.Api.Repositories.Interfaces;
using EcommerceAiRecommendation.Api.Services;
using EcommerceAiRecommendation.Api.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

const string FrontendCorsPolicy = "FrontendLocalDevelopment";

builder.Services.AddControllers();
builder.Services.AddSingleton<IProductRepository, InMemoryProductRepository>();
builder.Services.AddSingleton<ICoViewRepository, InMemoryCoViewRepository>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IRecommendationService, RecommendationService>();
builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",
                "http://localhost:3001"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);

    if (File.Exists(xmlPath))
    {
        options.IncludeXmlComments(xmlPath);
    }
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Ecommerce AI Recommendation API v1");
        options.RoutePrefix = "swagger";
    });
}

app.UseHttpsRedirection();

app.UseCors(FrontendCorsPolicy);

app.UseAuthorization();

app.MapGet("/health", () => Results.Ok(new
{
    status = "Healthy",
    service = "Ecommerce AI Recommendation API"
}))
    .WithName("GetHealth")
    .WithSummary("檢查 API 服務狀態")
    .WithDescription("回傳後端服務是否可正常回應，用於本機開發與展示前的健康檢查。")
    .Produces(StatusCodes.Status200OK);

app.MapControllers();

app.Run();
